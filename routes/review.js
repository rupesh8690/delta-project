const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const Review=require("../models/review.js")
const { validateReview, isLoggedIn, isReviewAuthor} =require("../middleware.js");
const  { reviewSchema }=require("../schema.js")

const reviewController = require("../controller/review.js");


  

//post Review route
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview))

  
  
  //delete Review route
  router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))

  module.exports=router;
