const mongoose = require("mongoose");


dentistSchema = new mongoose.Schema({
    ID: {
        type: Number,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true,
        // unique: true
    },
    username: {
        type: String,
        // required: true,
        // unique: true
    },
    password: {
        type: String,
        // required: true
    },
    clinics: [
        {
            clinic_id: {
                type: String,
            }
        }
    ],
    image: {
        type: String
    }
})


exports.dentistModel = new mongoose.model("dentist", dentistSchema);