const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      //nested populate to get author
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //hami sang vaeko listing to vitra ko harek reviews lai populate gareko

  if (!listing) {
    req.flash("error", "Listing you are requested for does not exist!");
    res.redirect("/listings");
  }
  // console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {

  let search = req.body.listing.location;
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url," " ,filename);
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  // console.log(result);
  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id; //storing current user as owner
  // Save the new listing to the database
  await newListing.save();
  req.flash("success", "New Listing created");

  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const result = await Listing.findById(id);
  if (!result) {
    req.flash("error", "Listing you are requested for does not exist!");
    res.redirect("/listings");
  }

  //changing the original image with blur effect using cloudinary
  let originalImageUrl = result.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_150");
  res.render("./listings/edit.ejs", { result, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  //if req. vitra file x then do as follows
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
