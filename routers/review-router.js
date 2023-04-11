const reviewRouter = require('express').Router();
const {getReviews, getReviewById, patchReviewById} = require('../controllers/review-controllers')

reviewRouter.get("/", getReviews);
reviewRouter.get("/:review_id", getReviewById);
reviewRouter.patch("/:review_id", patchReviewById);

module.exports = reviewRouter;