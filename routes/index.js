var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");

// root route
router.get("/", function(req, res) {
	res.render("landing.ejs");
});

// abotu route 
router.get("/about", function(req, res) {
	res.render("about.ejs", {page: "about"})
});

//AUTH ROUTES

router.get("/register", function(req, res) {
	res.render("register.ejs", {page: "register"});
});

//handle sign up logic

router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	//Passport does not store your password ever

	//Register the user to database
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash("error", err.message);
			res.redirect("/register");
		} else {
			//If registered successfully, authenticate user and create session
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome to Campster, " + user.username + "!");
				res.redirect("/campgrounds");
			});
		}
	});
});

//LOGIN ROUTES

router.get("/login", function(req, res) {
	res.render("login.ejs", {page: "login"});
});

var authParams = {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true
}

router.post("/login", passport.authenticate("local", authParams), function(req, res) {});

router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("back");
});

module.exports = router;