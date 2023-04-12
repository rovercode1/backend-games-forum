const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

const seed = require("./../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => connection.end());

describe("api", () => {
  describe("server errors", () => {
    it("404 GET - responds with msg when sent unavailable.", () => {
      return request(app)
        .get("/notARoute")
        .expect(404)
        .then(({ body }) => {
          const serverResponseMsg = body.msg;
          expect(serverResponseMsg).toBe("Path not found.");
        });
    });
  });

  describe("/api/categories", () => {
    it("200 GET - responds with all catgories with correct properties.", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const categories = body.categories;
          expect(categories.length).toBe(4);
          categories.forEach((category) => {
            expect(category.hasOwnProperty("slug", expect.any(String))).toBe(
              true
            );
            expect(
              category.hasOwnProperty("description", expect.any(String))
            ).toBe(true);
          });
        });
    });
  });

  describe("/api/users", () => {
    it("200 GET - responds with array of user objects with correct properties.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body.users;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });

  describe("/api/users/:username", () => {
    it("200 GET - responds with user object with correct properties.", () => {
      return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then(({ body }) => {
          const user = body.user;
          expect(user).toMatchObject({
            username: "mallionaire",
            name: "haz",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    it("404 GET - responds with msg when sent valid but non-existent username", () => {
      return request(app)
        .get("/api/users/notanusername")
        .expect(404)
        .then(({ body }) => {
          const serverResponseMsg = body.msg;
          expect(serverResponseMsg).toBe("User not found.");
        });
    });
  });

  describe("/api/reviews", () => {
    describe("GET", () => {
      it("200 - responds array of review objects, including the correct properties.", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            const reviews = body.reviews;
            expect(reviews.length).toBe(13);
            reviews.forEach((review) => {
              expect(review).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(String),
              });
            });

            const foundReview = reviews.find((review) => {
              if (review.review_id === 2) {
                return review;
              }
            });

            expect(foundReview.comment_count).toBe("3");
          });
      });
      it("200 - responds with reviews sorted by date in descending order.", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            const reviews = body.reviews;

            const reviewDates = reviews.map((review) => {
              return review.created_at;
            });
            expect(reviewDates).toBeSorted({ descending: true });
          });
      });
    });
    describe("POST", () => {
      it("201 - responds with the posted review.", () => {
        return request(app)
          .post("/api/reviews")
          .send({
            owner: "mallionaire",
            title: "This is a new review!",
            review_body: "Blah blah blah blahhhh",
            designer: "Anouk",
            category: "dexterity",
            review_img_url: "https://image.cnbcfm.com/api/v1/image/104151701-GettyImages-143949731.jpg",
          })
          .expect(201)
          .then(({ body }) => {
            const review = body.review;
            expect(review).toMatchObject({
              review_id: expect.any(Number),
              votes: 0,
              created_at: expect.any(String),
              review_body: "Blah blah blah blahhhh",
              designer: "Anouk",
              category: "dexterity",
              review_img_url: "https://image.cnbcfm.com/api/v1/image/104151701-GettyImages-143949731.jpg",
            });
          });
      });
      it("201 - responds with default review image if not provided.", () => {
        return request(app)
        .post("/api/reviews")
        .send({
          owner: "mallionaire",
          title: "This is a new review!",
          review_body: "Blah blah blah blahhhh",
          designer: "Anouk",
          category: "dexterity",
          review_img_url: "",
        })
        .expect(201)
        .then(({ body }) => {
          const review = body.review;
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            review_body: "Blah blah blah blahhhh",
            designer: "Anouk",
            category: "dexterity",
            review_img_url: "https://get.pxhere.com/photo/game-recreation-yellow-board-game-gamble-sports-double-six-games-luck-lucky-dice-dice-game-indoor-games-and-sports-tabletop-game-1259426.jpg",
          });
        });
      });
      it("201 - ignores irrelevant properties responds with the posted review.", () => {
        return request(app)
        .post("/api/reviews")
        .send({
          owner: "mallionaire",
          title: "This is a new review!",
          review_body: "Blah blah blah blahhhh",
          designer: "Anouk",
          category: "dexterity",
          review_img_url: "",
          something:'irrelevant'
        })
        .expect(201)
        .then(({ body }) => {
          const review = body.review;
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            review_body: "Blah blah blah blahhhh",
            designer: "Anouk",
            category: "dexterity",
            review_img_url: "https://get.pxhere.com/photo/game-recreation-yellow-board-game-gamble-sports-double-six-games-luck-lucky-dice-dice-game-indoor-games-and-sports-tabletop-game-1259426.jpg",
          });
        });
      });
    });
  });

  describe("/api/reviews?query", () => {
    describe("GET", () => {
      it("200 - responds with an array of review objects where category = query.", () => {
        return request(app)
          .get("/api/reviews?category=euro+game")
          .expect(200)
          .then(({ body }) => {
            const reviews = body.reviews;
            expect(reviews[0]).toMatchObject({
              title: "Agricola",
              owner: "mallionaire",
              review_id: 1,
              category: "euro game",
              review_img_url:
                "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
              review_body: "Farmyard fun!",
              created_at: "2021-01-18T10:00:20.514Z",
              votes: 1,
              designer: "Uwe Rosenberg",
              comment_count: "0",
            });
          });
      });

      it("200 - responds with an array of review objects where sort_by = query.", () => {
        return request(app)
          .get("/api/reviews?sort_by=owner")
          .expect(200)
          .then(({ body }) => {
            const reviews = body.reviews;
            expect(reviews.length).toBe(13);
            expect(reviews[0].owner).toBe("philippaclaire9");
            const reviewOwners = reviews.map((review) => {
              return review.owner;
            });
            expect(reviewOwners).toBeSorted({ descending: true });
          });
      });

      it("200 - responds with an array of review objects where order = query.", () => {
        return request(app)
          .get("/api/reviews?order=asc")
          .expect(200)
          .then(({ body }) => {
            const reviews = body.reviews;
            expect(reviews.length).toBe(13);
            expect(reviews[0].review_id).toBe(13);
            const reviewDefault = reviews.map((review) => {
              return review.created_at;
            });
            expect(reviewDefault).toBeSorted({ descending: false });
          });
      });

      it("200 - responds with queried array of review objects.", () => {
        return request(app)
          .get("/api/reviews?category=social+deduction&sort_by=votes&order=asc")
          .expect(200)
          .then(({ body }) => {
            const reviews = body.reviews;
            expect(reviews.length).toBe(11);
            reviews.forEach((review) => {
              expect(review).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: "social deduction",
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(String),
              });
            });
            const reviewVotes = reviews.map((review) => {
              return review.votes;
            });
            expect(reviewVotes).toBeSorted({ descending: false });
            expect(reviews[10].votes).toBe(100);
          });
      });
      it("200 - endpoint should default with DESC if there isn't order query.", () => {
        return request(app)
          .get("/api/reviews?category=social+deduction&sort_by=title")
          .expect(200)
          .then(({ body }) => {
            const reviews = body.reviews;
            const reviewTitles = reviews.map((review) => {
              return review.title;
            });
            expect(reviewTitles).toBeSorted({ descending: true });
          });
      });
      it("200 - returns empty array if category that exists but does not have any reviews associated with it.", () => {
        return request(app)
          .get("/api/reviews?category=children%27s+games")
          .expect(200)
          .then(({ body }) => {
            const reviews = body.reviews;
            expect(reviews).toEqual([]);
          });
      });
      it("400 - returns msg if order !== 'asc' / 'desc'.", () => {
        return request(app)
          .get("/api/reviews?order=upside+down")
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });

      it("400 - returns msg if sort by column that doesn't exist.", () => {
        return request(app)
          .get("/api/reviews?sort_by=does+not+exist")
          .expect(400)
          .then(({body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });
    });
    describe("PATCH", () => {
      it("201 - responds with the updated review.", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: "+1" })
          .expect(201)
          .then(({ body }) => {
            const review = body.review;
            expect(review.votes).toBe(2);
          });
      });

      it("201 - ignores other properties responds with the updated review.", () => {
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: "-100", name: "Anouk" })
          .expect(201)
          .then(({ body }) => {
            const review = body.review;
            expect(review.votes).toBe(-95);
          });
      });
      it("400 - responds with msg bad request if passed a non-number.", () => {
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: "notanumber" })
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });
      it("400 - responds with msg bad request if inc_votes not included.", () => {
        return request(app)
          .patch("/api/reviews/2")
          .send({ not_votes: "2" })
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });
      it("400 - responds with msg bad request if sent to invaild review id.", () => {
        return request(app)
          .patch("/api/reviews/badrequest")
          .send({ inc_votes: "2" })
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });

      it("404 - responds with msg when sent valid but non-existent path.", () => {
        return request(app)
          .patch("/api/reviews/99999999")
          .send({ inc_votes: "5" })
          .expect(404)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Review not found.");
          });
      });
    });
  });

  describe("/api/reviews/review_id", () => {
    describe("GET", () => {
      it("200 - responds with single review object.", () => {
        return request(app)
          .get("/api/reviews/2")
          .expect(200)
          .then(({ body }) => {
            const review = body.review;
            expect(review).toMatchObject({
              review_id: 2,
              title: "Jenga",
              category: "dexterity",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_body: "Fiddly fun for all the family",
              review_img_url:
                "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
              created_at: "2021-01-18T10:01:41.251Z",
              votes: 5,
              comment_count: "3",
            });
          });
      });

      it("400 - invalid review id responds with bad request msg.", () => {
        return request(app)
          .get("/api/reviews/bad-request")
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });

      it("404 - responds with msg when sent valid but non-existent path.", () => {
        return request(app)
          .get("/api/reviews/99999999")
          .expect(404)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Review not found.");
          });
      });
    });
    describe("PATCH", () => {
      it("201 - responds with the updated review.", () => {
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: "100" })
          .expect(201)
          .then(({ body }) => {
            const review = body.review;

            expect(review).toMatchObject({
              review_id: 2,
              title: "Jenga",
              category: "dexterity",
              designer: "Leslie Scott",

              owner: "philippaclaire9",
              review_body: "Fiddly fun for all the family",
              review_img_url:
                "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
              created_at: "2021-01-18T10:01:41.251Z",
              votes: 105,
            });
          });
      });

      it("201 - ignores other properties responds with the updated review.", () => {
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: "-100", name: "Anouk" })
          .expect(201)
          .then(({ body }) => {
            const review = body.review;
            expect(review.votes).toBe(-95);
          });
      });

      it("400 - responds with msg if inc_votes not included.", () => {
        return request(app)
          .patch("/api/reviews/bad-request")
          .send({ not_votes: "2" })
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });
      it("400 - responds with msg if sent to invalid review id.", () => {
        return request(app)
          .patch("/api/reviews/bad-request")
          .send({ inc_votes: "2" })
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });

      it("400 - responds with msg if passed a non-number.", () => {
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: "notanumber" })
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });

      it("404 - responds with msg when sent valid but non-existent path.", () => {
        return request(app)
          .patch("/api/reviews/99999999")
          .send({ inc_votes: "5" })
          .expect(404)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Review not found.");
          });
      });
    });
  });

  describe("/api/comments/review/:review_id/", () => {
    describe("POST", () => {
      it("201 - responds with the posted comment.", () => {
        return request(app)
          .post("/api/comments/review/6")
          .send({ username: "mallionaire", body: "This is a new comment!" })
          .expect(201)
          .then(({ body }) => {
            const comment = body.comment;
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: "This is a new comment!",
              review_id: 6,
              author: "mallionaire",
              votes: 0,
              created_at: expect.any(String),
            });
          });
      });
      it("201 - ignores irrelevant properties responds with the posted comment.", () => {
        return request(app)
          .post("/api/comments/review/8")
          .send({
            username: "mallionaire",
            body: "Ignore the fruit!",
            fruit: "banana",
          })
          .expect(201)
          .then(({ body }) => {
            const comment = body.comment;
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: "Ignore the fruit!",
              review_id: 8,
              author: "mallionaire",
              votes: 0,
              created_at: expect.any(String),
            });
          });
      });
      it("404 - responds with msg when sent valid but non-existent path.", () => {
        return request(app)
          .post("/api/comments/review/99999999")
          .send({ username: "mallionaire", body: "This is a new comment!" })
          .expect(404)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Review not found.");
          });
      });

      it("404 - responds with msg when sent invalid username.", () => {
        return request(app)
          .post("/api/comments/review/10")
          .send({ username: "not_a_username", body: "This is a new comment!" })
          .expect(404)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("User not found.");
          });
      });

      it("400 - invalid review id responds with bad request msg.", () => {
        return request(app)
          .post("/api/comments/review/bad-request")
          .send({ username: "mallionaire", body: "This is a new comment!" })
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });

      it("400 - missing fileds responds with bad request msg.", () => {
        return request(app)
          .get("/api/reviews/bad-request")
          .send({ not: "the_correct_field" })
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });
    });

    describe("GET", () => {
      it("200 - responds with an array of comments for the given review_id.", () => {
        return request(app)
          .get("/api/comments/review/3")
          .expect(200)
          .then(({ body }) => {
            const comments = body.comments;

            expect(body.comments.length).toBe(3);
            comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: expect.any(String),
                review_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              });
            });
          });
      });

      it("200 - comments should be sorted by date in descending order.", () => {
        return request(app)
          .get("/api/comments/review/3")
          .expect(200)
          .then(({ body }) => {
            const comments = body.comments;

            const commentDates = comments.map((comment) => {
              return comment.created_at;
            });
            expect(commentDates).toBeSorted({ descending: true });
          });
      });

      it("200 - review with no comments should return an empty array.", () => {
        return request(app)
          .get("/api/comments/review/8")
          .expect(200)
          .then(({ body }) => {
            const comments = body.comments;
            expect(comments).toEqual([]);
          });
      });

      it("404 - responds with msg when sent valid but non-existent review id.", () => {
        return request(app)
          .get("/api/comments/review/74872")
          .expect(404)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;

            expect(serverResponseMsg).toBe("Comment not found.");
          });
      });

      it("400 - responds with msg when sent invalid review id request.", () => {
        return request(app)
          .get("/api/comments/review/bad-request")
          .expect(400)
          .then(({ body }) => {
            const serverResponseMsg = body.msg;
            expect(serverResponseMsg).toBe("Bad request.");
          });
      });
    });
  });

  describe("/api/comments/:comment_id", () => {
    it("201 PATCH - responds with the updated comment.", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: "+1" })
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment.votes).toBe(14);
        });
    });
    it("201 PATCH - ignores other properties responds with the updated review.", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: "+1", soup: "tomato" })
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment.votes).toBe(14);
        });
    });
    it("400 PATCH - responds with msg if inc_votes not included.", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ just: "soup" })
        .expect(400)
        .then(({ body }) => {
          const serverResponseMsg = body.msg;
          expect(serverResponseMsg).toBe("Bad request.");
        });
    });
    it("400 PATCH - responds with msg if sent to invalid review id.", () => {
      return request(app)
        .patch("/api/comments/bad-request")
        .send({ inc_votes: "+1" })
        .expect(400)
        .then(({ body }) => {
          const serverResponseMsg = body.msg;
          expect(serverResponseMsg).toBe("Bad request.");
        });
    });
    it("400 PATCH - responds with msg if passed a non-number.", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: "notanumber" })
        .expect(400)
        .then(({ body }) => {
          const serverResponseMsg = body.msg;
          expect(serverResponseMsg).toBe("Bad request.");
        });
    });
    it("404 PATCH - responds with msg when sent valid but non-existent path.", () => {
      return request(app)
        .patch("/api/comments/12345")
        .send({ inc_votes: "+1" })
        .expect(404)
        .then(({ body }) => {
          const serverResponseMsg = body.msg;
          expect(serverResponseMsg).toBe("Comment not found.");
        });
    });

    //Invalid comment id
    //invalid
    it("204 DELETE - removes comment from database.", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
  });
});
