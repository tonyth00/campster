var express = require("express");

//in comments route, req.params does not contain the campground id
//adding {mergeParams: true} gives req.params the id. Very "hacky" solution
var router = express.Router({mergeParams: true}); 

var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
//var middleware = require("../middleware/index.js");
//if we name it index.js we do not need to explicitly require the file,
//JS will automatically get index.js by default
var middleware = require("../middleware");


//COMMENTS ROUTES

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (!err) {
			res.render("comments/new.ejs", {campground: foundCampground});
		} else {
			console.log(err);
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (!err) {
			Comment.create(req.body.comment, function (err, comment) {
				if (!err) {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					console.log("New Comment:");
					console.log(comment);
					foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect("/campgrounds/" + req.params.id);
				} else {
					console.log(err);
				}
			});

			
		} else {
			console.log(err);
			res.redirect("/campgrounds");
		}
	});
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (!err) {
			Comment.findById(req.params.comment_id, function(err, comment) {
				if (!err) {
					res.render("comments/edit.ejs", {comment: comment, campground: campground});


				} else {
					console.log(err);
					res.redirect("back");
				}
			});
		} else {
			console.log(err);
			res.redirect("back");
		}
	});


	
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
		if (err) {
			console.log(err);
		}
		res.redirect("/campgrounds/" + req.params.id);
	});
});


//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {

		if (!err) {
			Campground.findById(req.params.id, function (err, campground) {
				for (var i = 0; i < campground.comments.length; i++) {
					
					if (campground.comments[i]._id.equals(req.params.comment_id)) {
						campground.comments.splice(i, 1);
						campground.save();
						break;
					}
				}
			});

			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			console.log(err);
			res.redirect("back");
		}
	});
});

module.exports = router;