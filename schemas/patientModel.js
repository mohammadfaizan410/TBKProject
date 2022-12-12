const mongoose  = require("mongoose");

 patientSchema = {
    ID: {
        type: Number,
        // required : true
    },
    name: {
        type: String,
        // required: true
     },
     email: {
         type: String,
        //  required: true,
        //  unique: true
     },
     username: {
         type: String,
        //  required: true,
        //  unique: true
     },
     password: {
         type: String,
        //  required:true
     }
}

exports.patientModel = new mongoose.model("patient",patientSchema);