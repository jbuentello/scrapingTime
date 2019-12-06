// Set up Dependencies
var mongojs = require("mongojs");
var axios = require ("axios");
var express = require ("express");
var cheerio = require("cheerio");
var exphbs = require ("express-handlebars");

var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.static("public"));

//Handlebars templating setup
app.engine("handlebars", exphbs({ defaultLayout: "solo" }));
app.set("view engine", "handlebars");

var dataCollect = ["collectedData"];

// Change mongojs to db var, this is not working correctly, MongoDB was corrupt throwing a 100 error. Trying to resolve. 
// var db = mongojs(process.env.MONGODB_URI || 'scraper', dataCollect);
// db.on("error", function (error) {
//   console.log("Database:", error);
// });
//Render the data into index.handlebars
app.get("/", function (req, res) {
  res.render("index");
})

// Use axios (app.get) to pull data from site
app.get("/scrape", function(req, res) {
  // db.collectedData.drop()

//Get the data using axios then create a varaiable to put that data in
  axios.get("https://www.npr.org/sections/news/").then(function (response){
      
        var $ = cheerio.load(response.data);
        var results = [];
        console.log(response);

      $("#overflow").each(function(i, element) {

        //set up where to locate each element
        var title = $(element)
          .find("h2")
          .children("a")
          .text();
          console.log(title);
        var link = $(element)
          .find("h2")
          .children("a")
          .attr("href");
          console.log(link)
        var image = $(element)
          .find("img")
          .attr("src");
          console.log(image)
        var summary = $(element)
          .find("p").text()
          // .children("a")
          // .text()
          console.log(summary)

        //Insert the data to HTMl
        if (title && link && image && summary) {
          db.collectedData.insert({
            title: title,
            link: link,
            image: image,
            summary: summary
          }, 
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log("collectedData")
              console.log(inserted);
            }
          });
        }
      });
    
          // Log the results once you've looped through each of the elements found with cheerio
          console.log(results);
        })
});
    
    
    app.get("/all", function (req, res) {
      db.collectedData.find({}, function (err, found) {
        if (err) {
          console.log(err)
        } else {
          res.json(found)
        }
      });
    });
    
    
    //title route 
    app.get("/title", function(req, res) {
     
      db.collectedData.find().sort({ title: 1 }, function(error, found) {
        // Log any errors if the server encounters one
        if (error) {
          console.log(error);
        }
        // Otherwise, send the result of this query to the browser
        else {
          res.send(found);
        }
      });
    });


app.listen(PORT, function() {
  console.log("You are connected: " + PORT);
});
