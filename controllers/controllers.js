
const { getCategories } = require("./category-controllers.js");
const { getReviews, getReviewById, patchReviewById } = require("./review-controllers.js");
const { getCommentsByReviewid, postComment, deleteSelectedComment } = require("./comment-controllers.js");
const { getUsers } = require("./user-controllers.js");

const {
  handle404Errors,
  handle400Errors,
  handleServerErrors,
  handle500statuses,
} = require("./error-handling.js");


module.exports = {
  getUsers,
  getCategories,
  getReviews,
  getReviewById,
  patchReviewById,
  postComment,
  deleteSelectedComment,
  getCommentsByReviewid,
  handle404Errors,
  handle400Errors,
  handleServerErrors,
  handle500statuses,

};
