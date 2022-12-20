const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const { patientModel } = require("./schemas/patientModel");
const { dentistModel } = require("./schemas/dentistModel");
const { appointmentModel } = require("./schemas/appointmentModel");
const { clinicModel } = require("./schemas/clinicModel");
const { mediaModel } = require("./schemas/mediaModel");
const User = require("./schemas/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/TBK-DB", { useNewUrlParser: true });
const os = require("os");
const multer  = require('multer');
const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 5000000 }, fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  } });
const fs = require('file-system');    
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

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
  };

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
// this post is for the superuser ui where we add clinics to system
app.post("/createClinic", (req,res) =>{

    var clinic = new clinicModel({
        CID: req.body.cid,
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        cover_img: req.body.cover_img
    });

    clinic.save((err, results)=>{
        res.send(`{success: "Clinic saved. ${results._id}}`);
    })
});


app.post("/uploadMedia", upload.single('file'), (req, res) => {

    if(req.isAuthenticated()){
            console.log(req.file);
            var img = fs.readFileSync(req.file.path);
            var encode_image = img.toString('base64');
            // Define a JSONobject for the image attributes for saving to database
         
            var media = new mediaModel({
                contentType: req.file.mimetype,
                image: Buffer.from(encode_image, 'base64'),
                author: req.user.username
            });
            
            media.save((err, results)=>{
                res.send(`{ "success": "Media uploaded.", "mid":"${results._id}"}`);
            });
    }
});

app.get("/login", (req, res) => {
    if (req.isAuthenticated()) res.render("/")
    else
    res.render("login")
})

app.get("/services", (req, res) => {
    res.render("services", {loggedIn: req.isLoggedIn, user: req.user})
})


app.get("/register", (req, res) => {
    userType = req.query.type;
    //check if register page accessed from login to get user type
    !req.query.type ? res.redirect("/login") : res.render("register",{registered:registered});

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

 // app.get("/login", (req, res) => {
    // !req.query.type ? res.redirect("/loginOption") : res.render("login");
   
 // })

app.post("/login", passport.authenticate("local",{
    failureRedirect: "/login"
}), function(req, res){
    if(req.user.userType == "patient")
    res.render("views/index", {loggedIn: req.loggedIn, user: req.user});

    else if(req.user.userType == "dentist")
    res.render("dentist", {loggedIn: req.loggedIn, user: req.user});
    
    else if(req.user.userType == "superUser")
    res.render("superUser", {loggedIn: req.loggedIn, user: req.user});
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        req.isLogged = true;
    }
}

app.listen(port, function () {
    console.log("the server is up and running!");
})


/** 
 * ADD AN SUPER USER INTO LOCAL DEV SPACE
User.register(new User({username: "tbk_dental", userType : "superUser"}), "tbk_root", function(err, user){

    console.log(user+"registered.");
});
*/