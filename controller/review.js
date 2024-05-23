const Review = require("../models/review")
const Listing = require("../models/listing")
const  {listingSchema, reviewSchema }=require("../schema.js")

module.exports.createReview = async(req,res,next) =>{
    try{
    
    //accessing id from url
    let listing= await Listing.findById(req.params.id)
   
    let newReview=new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    
    //listing ko vitra jun review cha tyasma push garne
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();

    req.flash("success","New review added!");
  
    // console.log("data saved");
  
    //getting olny id
    const id = listing._id.toString();
  res.redirect(`/listings/${id}`);
  
    }
    catch(error){
      next(error);
    }
  }


  module.exports.deleteReview = async(req,res) =>{
    let {id,reviewId} =req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}}) // reviews array vitra matchig jati pani review id chan uslai pull garne meand delete garne
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  }