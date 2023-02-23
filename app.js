const express = require("express");
const app = express();

const {
  getCategories,
  getReviewById,
  getReviews,
  getCommentsByReviewid,
  patchReviewById,
   handleServerErrors,
  handle404Errors,
  handle400Errors,
  handle500statuses,
} = require("./controllers/controllers");

app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewid);
app.patch("/api/reviews/:review_id", patchReviewById);


app.use(handle404Errors);
app.use(handle400Errors);
app.use(handleServerErrors);
app.use(handle500statuses);

module.exports = app;
