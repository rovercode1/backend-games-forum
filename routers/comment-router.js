const commentRouter = require('express').Router();
const {getCommentsByReviewid, deleteSelectedComment, postComment, updateSelectedComment} = require('../controllers/comment-controllers')

commentRouter.get("/review/:review_id", getCommentsByReviewid);
commentRouter.post("/review/:review_id", postComment);
commentRouter.delete("/:comment_id", deleteSelectedComment);
commentRouter.patch("/:comment_id", updateSelectedComment);

module.exports = commentRouter;