const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    date: Date,

    patient: String,

    dentist: String,

    status: String

});

exports.appointmentModel = new mongoose.model("appointment", appointmentSchema);