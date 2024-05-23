
const Listing = require("../models/listing");

module.exports.search = async (req, res, next) => {
  try {
    let { q } = req.query;
    const searchedList = await Listing.find({ country: { $regex: q, $options: 'i' } });
    if(searchedList.length === 0)
      {
        req.flash("error","No records found!");
        res.redirect("./listings");
      }
      else{
        res.render('./listings/search', { searchedList, successMsg: req.flash('success') });
      }


    
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};
