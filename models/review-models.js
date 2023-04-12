const { query } = require("./../db/connection.js");
const format = require("pg-format");
const db = require("./../db/connection.js");
const { off } = require("../app.js");

exports.selectReviews = (queries) => {
  let {category, sort_by, order, limit, p } = queries

  const vaildSortBy = [
    "title",
    "designer",
    "owner",
    "review_body",
    "category",
    "created_at",
    "votes",
    "comment_count",
  ];

  const vaildOrder = ["ASC", "DESC"];

  let queryString = `
    SELECT reviews.title, reviews.owner, reviews.review_id, reviews.category, review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comment_id) as comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
  `;

  if (category !== undefined) {
    if (category.includes("'")) {
      category = category.replaceAll("'", "''");
    }
    let formattedCategory = `'${category}'`;
    queryString += ` 
    WHERE reviews.category=${formattedCategory}
    GROUP BY reviews.review_id`;
  } else {
    queryString += ` GROUP BY reviews.review_id`;
  }

  if (sort_by !== undefined) {
    if (!vaildSortBy.includes(sort_by)) {
      return Promise.reject("Bad request.");
    }
    if (sort_by === "comment_count") {
      queryString += ` ORDER BY ${sort_by}`;
    } else {
      queryString += ` ORDER BY reviews.${sort_by}`;
    }
  } else {
    queryString += ` ORDER BY reviews.created_at`;
  }

  if (order !== undefined) {
    if (!vaildOrder.includes(order.toUpperCase())) {
      return Promise.reject("Bad request.");
    }
    queryString += ` ${order}`;
  } else {
    queryString += ` DESC`;
  }

  if(p){
    if(limit){
      const offset = (p - 1) * limit
      queryString += ` LIMIT ${limit} OFFSET ${offset};`
    }else{
      const offset = (p - 1) * 10
      queryString += ` LIMIT 10 OFFSET ${offset};`
    }
  }  


  return db.query(queryString).then((reviews) => {
    return reviews.rows;
  });
};

exports.insertReview = (requestedPost) => {
  const { owner, title, review_body, designer, category } = requestedPost;
  let { review_img_url } = requestedPost;
  review_img_url === ""
    ? (review_img_url =
        "https://get.pxhere.com/photo/game-recreation-yellow-board-game-gamble-sports-double-six-games-luck-lucky-dice-dice-game-indoor-games-and-sports-tabletop-game-1259426.jpg")
    : null;
  const formattedReview = [
    [owner, title, review_body, designer, category, review_img_url],
  ];

  let queryString = format(
    "INSERT INTO reviews (owner, title, review_body, designer, category, review_img_url) VALUES %L RETURNING *",
    formattedReview
  );
  return db.query(queryString).then((review) => {
    if (review.rowCount === 0) {
      return Promise.reject("Review not found.");
    }
    return review.rows[0];
  });
};

exports.selectReviewById = (reviewId) => {
  let queryString = `
  SELECT reviews.title, reviews.owner , reviews.review_id, reviews.category, review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comment_id) as comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id 
  `;
  let queryParam = [];

  if (reviewId !== undefined) {
    queryString += ` 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    ORDER BY created_at DESC
    `;
    queryParam.push(reviewId);
  }
  return db.query(queryString, queryParam).then((review) => {
    if (review.rowCount === 0) {
      return Promise.reject("Review not found.");
    }
    return review.rows[0];
  });
};

exports.updateReviewById = (reviewId, patchRequest) => {
  if (!patchRequest.hasOwnProperty("inc_votes")) {
    return Promise.reject("Bad request.");
  }

  const votesUpdate = patchRequest.inc_votes;

  let queryString = `
  UPDATE reviews
  SET votes = votes`;

  votesUpdate.includes("-")
    ? (queryString += ` ${votesUpdate}`)
    : (queryString += ` +${votesUpdate}`);
  let queryParam = [];

  if (reviewId !== undefined) {
    queryString += ` 
    WHERE review_id = $1  
    
    RETURNING *`;
    queryParam.push(+reviewId);
  }

  return db.query(queryString, queryParam).then((review) => {
    if (review.rowCount === 0) {
      return Promise.reject("Review not found.");
    }
    return review.rows[0];
  });
};
