
const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");


clinicSchema = new mongoose.Schema({
        CID: {
            type: Number,
            // required : true
        },
        Title: {
            type: String,
            // required : true
        },
        description: {
            type: String,
            // required : true
        },
        address: {
            type: String,
            // required: true
        },
        cover_img: {
            type: String,
            // required: true
        },
        dentists: [
            {
                dentist_name: {
                    // type: String,
                    // required: true
            }
        }
    ]

})

exports.clinicModel = new mongoose.model("clinic", clinicSchema);