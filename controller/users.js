const User = require("../models/user")


module.exports.signup = async(req,res) =>{

    try{
    let {username,email,password }= req.body;
    const newUser = new User( {email,username})
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    //if user is signed up loging to the ssystem directly
    // read this documentation https://www.passportjs.org/concepts/authentication/login/
    req.login(registerUser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
  
    }
    catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.rednerSignupForm = (req,res) =>{
    res.render("user/signup.ejs");

}

module.exports.renderLoginForm = (req,res) =>{
    res.render("user/login.ejs");
}

module.exports.login =  async(req,res) =>{
    //read about passport.authenticate at https://www.npmjs.com/package/passport
      req.flash("success", "Welcome to wanderlust");
      let redirectUrl= res.locals.redirectUrl || "/listings"
      //if redirect url is availble then go there otherwise go to lising
     res.redirect(redirectUrl);
}

module.exports.logout = (req,res)  =>{
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
        
    })
}