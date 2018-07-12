
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, campground) {
			if (!err) {
				//(req.user._id === campground.author.id) won't work since one is a string and the other is a mongoose object even though they print the same
				if (campground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("/campgrounds/" + req.params.id);
				}
				
				
			} else {
				req.flash("error", "Campground not found");
				res.redirect("/campgrounds");
			}
		});

	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/campgrounds/" + req.params.id);
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, comment) {
			if (!err) {
				if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("/campgrounds/" + req.params.id);
				}

			} else {
				console.log(err);
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/campgrounds/" + req.params.id);
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

module.exports = middlewareObj;