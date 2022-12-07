const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const { patientModel } = require("./schemas/patientModel");
const { dentistModel } = require("./schemas/dentistModel");
const { clinicModel } = require("./schemas/clinicModel");
var userDetailsLocal = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views")

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/loginOption", (req, res) => {
    res.render("loginOptions")
})
app.get("/services", (req, res) => {
    res.render("services")
})





app.listen(port, function () {
    console.log("the server is up and running!");
})