const mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

    UserSchema = new mongoose.Schema({
     username: {
         type: String,
         required: true,
         unique: true
        },
    password: {
        type: String,
        // required: true,
        },
    userType: {
        type: String,
        required: true
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", UserSchema);