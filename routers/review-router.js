const reviewRouter = require('express').Router();
const {getReviews, postReview ,getReviewById, patchReviewById} = require('../controllers/review-controllers')

reviewRouter.get("/", getReviews);
reviewRouter.post("/", postReview);
reviewRouter.get("/:review_id", getReviewById);
reviewRouter.patch("/:review_id", patchReviewById);

module.exports = reviewRouter;