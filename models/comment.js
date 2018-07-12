var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	text: String,
	//Associate author to comment
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String 
		//Adding the username property makes it easier, so we don't have to populate the User and get the username from there
	}
});

module.exports = mongoose.model("Comment", commentSchema);