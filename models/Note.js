var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//creating a new NoteSchema using the Schema constructor
var NoteSchema = new Schema({
	//title of type string
	title: String,
	//body of type string
	body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;