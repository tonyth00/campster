var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	//Associate comments to campground
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author: {
		username: String,
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);