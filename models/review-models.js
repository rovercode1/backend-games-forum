const { query } = require("./../db/connection.js");
const db = require("./../db/connection.js");

exports.selectReviews = (queries) => {
  // const vaildCategories = [
  //   "euro game",
  //   "social deduction",
  //   "dexterity",
  //   "children's games",
  // ];

  const vaildSortBy = [
    "title",
    "designer",
    "owner",
    "review_body",
    "category",
    "created_at",
    "votes",
    "comment_count"
  ];

  const vaildOrder = ["ASC", "DESC"];

  let queryString = `
  SELECT reviews.title, reviews.owner, reviews.review_id, reviews.category, review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comment_id) as comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id 
  `;

  if (queries.category !== undefined) {
    // if (!vaildCategories.includes(queries.category)) {
    //   return Promise.reject("Bad request.");
    // }

    if (queries.category.includes("'")) {
      queries.category = queries.category.replaceAll("'", "''");
    }
    const category = `'${queries.category}'`;
    queryString += ` 
    WHERE reviews.category=${category}
    GROUP BY reviews.review_id`;
  } else {
    queryString += ` 
    GROUP BY reviews.review_id`;
  }

  if (queries.sort_by !== undefined) {
    if (!vaildSortBy.includes(queries.sort_by)) {
      return Promise.reject("Bad request.");
    }
    if(queries.sort_by === 'comment_count'){
      queryString += ` 
      ORDER BY ${queries.sort_by}`;
    }else{
      queryString += ` 
      ORDER BY reviews.${queries.sort_by}`;
    }
  } else {
    queryString += ` 
    ORDER BY reviews.created_at`;
  }

  if (queries.order !== undefined) {
    if (!vaildOrder.includes(queries.order.toUpperCase())) {
      return Promise.reject("Bad request.");
    }

    queryString += ` ${queries.order}`;
  } else {
    queryString += ` DESC`;
  }
  return db.query(queryString).then((reviews) => {
    return reviews.rows;
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
      return Promise.reject("Content not found.");
    }
    return review.rows[0];
  });
};

exports.updateReviewById = (reviewId, votesUpdate) => {

  // console.log(!isNaN(votesUpdate))
  console.log(votesUpdate)

  let queryString = `
  UPDATE reviews
  SET votes = votes`;


  votesUpdate.includes('-')? queryString+= ` ${votesUpdate}` : queryString+=` +${votesUpdate}`
  let queryParam = [];

  if (reviewId !== undefined) {
    queryString += ` WHERE review_id = $1  RETURNING *`;
    queryParam.push(+reviewId);
  }

  return db.query(queryString, queryParam).then((review) => {
    if (review.rowCount === 0) {
      return Promise.reject("Content not found.");
    }
    return review.rows[0];
  });
};
