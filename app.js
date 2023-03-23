const express = require("express");
const cors = require('cors');
const app = express();

const {
  getEndpoints,
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

app.get('/api', (request, response, next)=>{
  response.sendFile('./endpoints.json')
  res.sendFile(path.join(__dirname, '../public', 'endpoints.json'));
  // response.status(200).send({api: })
})
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
