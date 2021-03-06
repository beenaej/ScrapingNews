var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//Scraping tool begins here
var axios = require("axios");
var cheerio = require("cheerio");

//requiring all models here
var db = require("./models");

var PORT = 3000;

//initialize express
var app = express();

//use morgan logger for logging requests
app.use(logger("dev"));

//use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

//use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//use mongoose to connect to Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapingPopulater");

//Routes
app.get("/scrape", function(req,res){
	axios.get("https://www.nytimes.com/section/world").then(function(response){
		var $ = cheerio.load(response.data);

		$("article h2").each(function(i, element){
			var result = {};

			result.title = $(this)
			.children("a")
			.text();
			result.link = $(this)
			.children("a")
			.attr("href");

		db.Article
			.create(result)
			.then(function(dbArticle){
				console.log(dbArticle);
			})
			.catch(function(err){
				return res.json(err);
			});
		});

		res.send("Scrape Complete");
	});
});

app.get("/articles", function(req, res){
	db.Article
	.find({})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

app.get("/articles/:id", function(req,res){
	db.Article
	.findOne({ _id:req.params.id })
	.populate("note")
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

//Route for saving and updating an Article's associated id
app.post("/articles/:id", function(req,res){
	db.Note
	.create(req.body)
	.then(function(dbNote){
		return db.Article.findOneAndUpdate({_id: req.params.id}, {note:dbNote._id}, {new: true});
			})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

app.listen(PORT, function(){
	console.log("App running on port " + PORT + "!");
});
	