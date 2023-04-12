const {selectReviews, selectReviewById, updateReviewById, insertReview} = require('../models/review-models')


exports.getReviews = (request, response, next)=>{
  selectReviews(request.query).then((reviews)=>{
    response.status(200).send({total_count: reviews.length, reviews: reviews})
  }).catch((err)=>{
    next(err)
  })
}

exports.postReview = (request, response, next)=>{
  const requestedPost = request.body
  insertReview(requestedPost).then((review)=>{
    response.status(201).send({review: review})
  }).catch((err)=>{
    next(err)
  })
}

exports.getReviewById = (request, response, next)=>{
  const reviewId = request.params.review_id;
  selectReviewById(reviewId)
    .then((review)=>{
      response.status(200).send({review: review})
    }).catch((err)=>{
      next(err)
    })
}

exports.patchReviewById = (request, response, next)=>{
  const reviewId = request.params.review_id;
  const patchRequest = request.body

  updateReviewById(reviewId, patchRequest)
  .then((review)=>{
    response.status(201).send({review: review})
  }).catch((err)=>{
    next(err)
  })

  
}