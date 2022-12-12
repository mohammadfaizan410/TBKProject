const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const { patientModel } = require("./schemas/patientModel");
const { dentistModel } = require("./schemas/dentistModel");
const { appointmentModel } = require("./schemas/appointmentModel");
const { clinicModel } = require("./schemas/clinicModel");
const User = require("./schemas/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/TBK-DB", { useNewUrlParser: true });    
app.use(require("express-session")({
    secret:"Miss white is my cat",
    resave: false,
    saveUninitialized: false
}));
//type of user
let userType = null;
//registered error
let registered = '';

let loginError = '';

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views")

app.all("*", (req, res, next) =>{
    if(req.isAuthenticated()){
        req.isLoggedIn = true;
        req.userType = req.user.userType;
    }
    else{
        req.isLoggedIn = false;
    }
    next();
});

app.get("/", (req, res) => {
    res.render("index", {loggedIn: req.isLoggedIn, user: req.user});
})

app.post("/bookAppointment", (req,res) =>{
    if(req.isAuthenticated()){
        
        var appointment = new appointmentModel({
            date: req.body.date,
            patient: req.body.patient,
            dentist: req.body.dentist,
            status: "WAITING_APPROVAL"
        });

        appointment.save((err, results)=>{
            res.send(`{success: ${"Appointment ID: " + results._id}}`);
        })

    }
    else
        res.send(`{err: "You are not logged in!"}`)
});

app.get("/loginOption", (req, res) => {
    if (req.isAuthenticated()) res.render("/")
    else
    res.render("loginOptions")
})

app.get("/services", (req, res) => {
    res.render("services", {loggedIn: req.isLoggedIn, user: req.user})
})


app.get("/register", (req, res) => {
    userType = req.query.type;
    //check if register page accessed from loginoption to get user type
    !req.query.type ? res.redirect("/loginOption") : res.render("register",{registered:registered});

})

//register user
app.post("/register", (req, res) => {
    User.register(new User({username: req.body.username, userType : userType}), req.body.password, function(err, user){
        if(err){
            //already registered
            registered = "username already exists!";
            return res.render("register",{registered : registered});
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
})

app.get("/login", (req, res) => {
    !req.query.type ? res.redirect("/loginOption") : res.render("login");
   
})

app.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){
    
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        req.isLogged = true;
    }
}

app.listen(port, function () {
    console.log("the server is up and running!");
})