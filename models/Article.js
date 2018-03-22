var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Next, we will create a new object modeled using the Schema constructor
var ArticleSchema = new Schema({

//title which is a type of string and is a required field
	title:{
		type: String,
		required: true
	},

	//link is a string and is a required field

	link: {
		type: String,
		required: true
	},
	//note is an object which holds the note id
	// ref links the objectid to the note model
	note:{
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

//next we are creating the Article model from the above schema

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;