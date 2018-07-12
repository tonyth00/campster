var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/", function(req, res) {
	//Get all campgrounds from DB
	Campground.find().sort({name: "ascending"}).exec(function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			//Render the file
			res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds, page: "campgrounds"});
		}
	});
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) {
	//Associate user data
	req.body.campground.author = 
	{
		id: req.user._id,
		username: req.user.username
	};

	geocoder.geocode(req.body.campground.location, function (err, data) {
	    if (err || !data.length) {
	      req.flash('error', 'Invalid address');
	      return res.redirect('back');
	    }
	    req.body.campground.lat = data[0].latitude;
	    req.body.campground.lng = data[0].longitude;
	    req.body.campground.location = data[0].formattedAddress;

		Campground.create(req.body.campground, function(err, campground) {
			if (err) {
				console.log(err);
			} else {
				
				console.log("New campground:");
				console.log(campground);

				res.redirect("/campgrounds");
			}
		});
	});
});


router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new.ejs");
});


//SHOW ROUTE
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show.ejs", {campground: foundCampground});

		}
	});
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (!err) {
			res.render("campgrounds/edit.ejs", {campground: campground});
		} else {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		}
		
	});
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	geocoder.geocode(req.body.campground.location, function (err, data) {
	    if (err || !data.length) {
	      req.flash('error', 'Invalid address');
	      return res.redirect('back');
	    }
	    req.body.campground.lat = data[0].latitude;
	    req.body.campground.lng = data[0].longitude;
	    req.body.campground.location = data[0].formattedAddress;

	    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
	        if(err){
	            req.flash("error", err.message);
	            res.redirect("back");
	        } else {
	            req.flash("success","Successfully Updated!");
	            res.redirect("/campgrounds/" + campground._id);
	        }
	    });
  	});
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (!err) {
			campground.comments.forEach(function(comment) {
				Comment.findByIdAndRemove(comment._id.toString(), function(err) {
					if (err) {
						console.log(err);
					}
				});
			});

			Campground.findByIdAndRemove(req.params.id, function(err) {
				if (err) {
					console.log(err);
					req.flash("error", "Failed to remove campground");
					//res.redirect("back");
					res.redirect("/campgrounds/" + req.params.id);
				} else {
					req.flash("success", "Sucessfully removed campground");
					res.redirect("/campgrounds");
				}
			});

			
		} else {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		}
		
	});
});

module.exports = router;