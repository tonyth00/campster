var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment  = require("./models/comment.js");

var lorem = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

var data = [
	{
		name: "Cloud's Rest", 
		image: "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=12ad75c31d4e110e677b814a6d61066a&auto=format&fit=crop&w=1052&q=80",
		description: lorem
	},
	{
		name: "Trees and Stuff", 
		image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c43eff2f7cb0c2f6838152683da69f81&auto=format&fit=crop&w=1050&q=80",
		description: lorem
	},
	{
		name: "Snowy Plains", 
		image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4d1156d3e4dfafbc71a9f293939f3243&auto=format&fit=crop&w=1995&q=80",
		description: lorem
	}

];

function seedDB() {
	Comment.remove({}, function(err) {
		if (!err) {
			console.log("Removed comments!");
		} else {
			console.log(err);
		}
	});
	Campground.remove({}, function(err) {
		// if (!err) {
		// 	console.log("Removed campgrounds!");
		// 	data.forEach(function(seed) {
		// 		Campground.create(seed, function(err, campground) {
		// 			if (!err) {
		// 				console.log("Added " + campground.name);

		// 				Comment.create(
		// 					{
		// 						text: "This place is great but I wish there was internet",
		// 						author: "Homer"
		// 					}, function(err, comment) {
		// 						if (!err) {
		// 							campground.comments.push(comment);
		// 							campground.save();
		// 							console.log("Created new comment");
		// 						} else {
		// 							console.log(err);
		// 						}
								
		// 					});

		// 			} else {
		// 				console.log(err);
		// 			}
		// 		});

		// 	});
		// }
	});
	//Add few comments
}


module.exports = seedDB;