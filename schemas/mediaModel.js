const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    contentType: String,
    author: String,
    image: Buffer
});

exports.mediaModel = new mongoose.model("media", mediaSchema);