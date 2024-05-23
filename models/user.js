
const mongoose=require("mongoose");
const Schema=mongoose.Schema; // instead of writing mongoose.shcema now we can use Schema only
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema= new Schema({
    email:{
        type:String,
        required:true
    }
})

// Plugin passportLocalMongoose to add username and password fields
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);
