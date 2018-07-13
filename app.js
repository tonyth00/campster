require('dotenv').config();

var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	flash 		= require("connect-flash"),
	methodOverride = require("method-override");
	expressSession = require("express-session"),
	
	seedDB = require("./seeds.js"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User  = require("./models/user.js");

var commentRoutes 		= require("./routes/comments.js"),
	campgroundRoutes 	= require("./routes/campgrounds.js"),
	indexRoutes 		= require("./routes/index.js");

//www.mlabs.com
//mongoose.connect("mongodb://user:password1@ds263380.mlab.com:63380/yelpcamp");
mongoose.connect(process.env.DATABASE_URL);
//process.env.databaseURL

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(expressSession({
	secret: "piano cat",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //Encode
passport.deserializeUser(User.deserializeUser()); //Decode

//Initialize default values for your views
//Is called on every single route
app.use(function(req, res, next) {
	res.locals.currentUser = req.user; //undefined without login
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("YelpCamp server started");
});

/*
RESTFUL ROUTES

name	url 	 	 	verb	description
============================================================
INDEX	/dogs			GET 	Display a list of all dog
NEW 	/dogs/new 		GET 	Display form to make a new dog
CREATE  /dogs 			POST 	Add new dog to DB
SHOW 	/dogs/:id       GET 	Shows info about one dog

*/
