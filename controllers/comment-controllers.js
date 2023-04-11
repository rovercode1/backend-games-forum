const { insertComment, selectComments, deleteComment, updateComment } = require("../models/comment-models");

exports.postComment = (request, response, next) => {
  const newComment = request.body;
  const reviewId = request.params.review_id;

  insertComment(newComment, reviewId)
    .then((postedComment) => {
      response.status(201).send({ comment: postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewid = (request, response, next) => {
  const reviewId = request.params.review_id;

  selectComments(reviewId)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};


exports.deleteSelectedComment = (request, response, next) => {
  const comment_id = request.params.comment_id;
  deleteComment(comment_id)
    .then(() => {
      response.status(204).send({msg: 'that worked!'})
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateSelectedComment = (request, response, next) => {
  const comment_id = request.params.comment_id;
  const patchRequest = request.body 

  updateComment(comment_id, patchRequest)
    .then((updatedComment) => {
      response.status(201).send({comment: updatedComment})
    })
    .catch((err) => {
      next(err);
    });
};

