// Set up Dependencies
var mongojs = require("mongojs");
var axios = require ("axios");
var express = require ("express");
var cheerio = require("cheerio");
var exphbs = require ("express-handlebars");

var app = express();
var PORT = process.env.PORT || 3000
app.use(express.static("public"));

//Handlebars templating setup
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var dataCollect = ["collectedData"];

// Change mongojs to db var
var db = mongojs(process.env.MONGODB_URI || 'scraper', dataCollect);
db.on("error", function (error) {
  console.log("Database:", error);
});
//Render the data into index.handlebars
app.get("/", function(req, res) {
  res.render("index");
})

// Use axios (app.get) to pull data from site
