const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../middleware.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,

  wrapAsync(listingController.createListing)
);

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
  .put(
    isLoggedIn,
     isOwner, 
     upload.single("listing[image]"), //cloudinary ma save garepachi validate garne
     validateListing,
     wrapAsync(listingController.updateListing)
    );

//edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
