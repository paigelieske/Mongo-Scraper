var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(express.static("public"));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//route to scrape for articles and pass to database
app.get("/scrape", function (req, res) {
    axios.get("http://www.makeuseof.com/")
        .then(function (response) {
            var $ = cheerio.load(response.data);
            console.log(response.data);
            $(".bullet-meta").each(function (i, element) {

                var result = {};

                result.title = $(this)
                    .find("h3")
                    .children("a")
                    .text();
                result.link = $(this)
                    .find("h3")
                    .children("a")
                    .attr("href");
                result.byline = $(this)
                    .children("p")
                    .text();

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
            res.send("Scrape Complete");
        });
});

//route to show the article JSON
app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//route to save an article by id
app.post("/saved/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//route to remove a saved article by id
app.post("/articles/delete/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//route to render the articles
app.get("/", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            var handlebars;
            handlebars = {
                articles: dbArticle
            };
            res.render("index", handlebars);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});