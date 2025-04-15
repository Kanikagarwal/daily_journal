//jshint esversion:6
const mongoose = require("mongoose")
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "A curated collection of reflections, insights, and narratives designed to inspire thoughtful engagement with the world around us. Daily Journal offers a space where words matter — where each entry is a quiet conversation between writer and reader.Whether exploring contemporary topics, personal growth, culture, or quiet musings, our journal aspires to bring depth, clarity, and nuance to the everyday.We invite you to pause, read, and reflect — one entry at a time.";
const aboutContent = "At Daily Journal, we believe in the quiet power of words to inform, inspire, and illuminate. What began as a simple space for daily reflections has evolved into a thoughtful platform for sharing stories that resonate — deeply and authentically.We are a collective of writers, thinkers, and creatives united by a common pursuit: to document the moments, ideas, and experiences that shape our lives. From contemplative essays to cultural commentary, our content is crafted with intention and intellectual curiosity.";
const contactContent = "We’d love to hear from you.Whether you have a question, a collaboration in mind, or simply wish to share your thoughts, we welcome meaningful connections. At Daily Journal, we value thoughtful dialogue and are always open to hearing from our readers, contributors, and partners.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/blogDB',{useNewUrlParser:true});
let blogSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Blog = mongoose.model("Blog",blogSchema);



app.get("/", function(req, res){
  Blog.find({}).then(function (posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
    
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  Blog.find({}).then(function (posts) {
    res.render("home",{
      startingContent: homeStartingContent,
    posts: posts
    })
  })


  res.redirect("/");

});

app.get("/posts/:id", function(req, res){
  const requestedId = req.params.id;
Blog.findOne({_id:requestedId}).then(function (post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  });
  


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
