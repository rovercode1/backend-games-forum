const commentRouter = require('express').Router();
const {getCommentsByReviewid, deleteSelectedComment, postComment} = require('../controllers/comment-controllers')

commentRouter.get("/:review_id", getCommentsByReviewid);
commentRouter.post("/:review_id", postComment);
commentRouter.delete("/:comment_id", deleteSelectedComment);

module.exports = commentRouter;