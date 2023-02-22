const express = require("express");
const app = express();
const {
  getCategories,
  getReviewById,
  getReviews,
  getCommentsByReviewid
} = require("./controllers/controllers");
const {
  handleServerErrors,
  handle404Errors,
  handle400Errors,
  handle500statuses,
} = require("./controllers/controllers");

app.get("/api/categories", getCategories);


//REFACTOR GET REVIEWS _ GETREVIEW BY ID AS SAME FUNCTION
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewid);

app.use(handle404Errors);
app.use(handle400Errors);
app.use(handleServerErrors);
app.use(handle500statuses);

module.exports = app;
