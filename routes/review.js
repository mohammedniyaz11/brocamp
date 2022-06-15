const express=require('express')
const router=express.Router()
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const Campground=require('../models/campground');
const {camgroundSchema,reviewSchema}=require('../schemas.js')
const Review=require('../models/review');
const {validateReview, isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews')






router.post('/campgrounds/:id/reviews',catchAsync(reviews.createReview))

router.delete('/campgrounds/:id/reviews/:reviewId',isLoggedIn,catchAsync(reviews.deleteReview))









    module.exports=router;