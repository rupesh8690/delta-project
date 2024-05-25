//accessing variable from .env file
if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

// console.log(process.env.SECRET)

const express = require('express')
const app = express()
const port = 3000
const Listing=require("./models/listing.js");
const ejsMate = require('ejs-mate'); // Add this line to import ejsMate
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
const ExpressError=require("./utils/ExpressError.js");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


const passport= require("passport")
const localStrategy=require("passport-local")
const User= require("./models/user.js");

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASDB_URL;

const store =MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600, // for lazy update after 24 hours


});

store.on("error", () =>{
  console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions ={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true, //basically used for security purpose
  }
}




app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

// app.get("/demouser", async(req,res) =>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student",
//   });

//   let newUser= await User.register(fakeUser,"helloworld")
//  res.send(newUser);
 
// })

const  listingSchema =require("./schema.js")
const  reviewSchema =require("./schema.js")
const Review=require("./models/review.js")

const listings=require("./routes/listing.js")
const reviews=require("./routes/review.js");
const user= require("./routes/user.js");
const listingsSearch= require("./routes/search.js");


//mongoose code
const mongoose = require('mongoose');

app.use(express.urlencoded( {extended: true}));
app.use(express.json());


var methodOverride = require('method-override');
const { nextTick } = require('process');
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,"/public")));



main().then((res) => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
})

async function main()
{
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}

// app.get('/', (req, res) => {
 
//   res.send("Hi, I am root")
// })

app.use("/listings",listings); // this line mean any request to a url that begin with '/listings' will be handled by 'listings
app.use("/listings/:id/reviews",reviews);
app.use("/", user);
app.use("/search",listingsSearch);


// app.get("/search", async(req,res) =>{
//   try{
//     let { q } = req.query;
//     const searchedList = await Listing.find({ country: { $regex: q, $options: 'i' } });
//         // Render the results in the template
//         res.render('./listings/search', { searchedList });



//   }
//   catch{
//     next(err);
//   }


// })



app.all("*",(req,res,next) => {
  next(new ExpressError(404, "Page not found!"));

})
app.use((err,req,res,next) => {
  // res.send("Something went wrong");
  let {statusCode=500,message="Something went wrong"}=err; //
  // if there is nothing in statucode then default it wiill be 500 and message will be somehting went wrong
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs" , {err})
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})