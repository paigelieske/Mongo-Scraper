var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
});

