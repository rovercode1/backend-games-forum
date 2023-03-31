const express = require("express");
const cors = require('cors');
const fs = require('fs');
const app = express();

const {
  getCategories,
  getReviews,
  getUsers,
  getReviewById,
  getCommentsByReviewid,

  postComment,
  patchReviewById,

  deleteSelectedComment,

  handleServerErrors,
  handle404Errors,
  handle400Errors,
  handle500statuses,
} = require("./controllers/controllers");

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  fs.readFile('endpoints.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading endpoints file');
    } else {
      const endpoints =  JSON.stringify(data, null, 2);
      res.json(endpoints);
    }
  });
});

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/users", getUsers);

app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewid);
app.patch("/api/reviews/:review_id", patchReviewById);
app.post("/api/reviews/:review_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteSelectedComment);

app.use(handle404Errors);
app.use(handle400Errors);
app.use(handleServerErrors);
app.use(handle500statuses);

module.exports = app;
