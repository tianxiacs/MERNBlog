// Express
const express = require("express");
const app = express();
// Body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// Sanitier
const expressSanitizer = require("express-sanitizer");
app.use(expressSanitizer());
// Method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Set ejs as the file default and public as the folder for css
app.use(express.static("public"));
app.set("view engine", "ejs");

// Connect MongoDB
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/ProjectBlog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB!'))
.catch(error => console.log(error.message));
// Identify a schema-like data pattern
let blogSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    content: String,
    timeOfCreation: {type: Date, default: Date.now}
})
let Blog = mongoose.model("Blog", blogSchema);

// =================
// Routes
app.get("/", function(req, res) {
    res.render("index");
});
// GET - Overview
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("Error occurred!")
            console.log(err);
        } else {
            //console.log("All friends are as follows:")
            //console.log(blogs);
            res.render("blogs", {blogs: blogs});
        }
    })
})
// POST - Create
app.post("/blogs", function(req, res) {
    //console.log(req.body.blog.content);
    req.body.blog.content = req.sanitize(req.body.blog.content);
    //console.log(req.body.blog.content);
    Blog.create(req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
        }else {
            //console.log(blog);
            res.redirect("/blogs");
        }
    })
})
// GET - NEW
app.get("/blogs/new", function(req, res) {
    res.render("new");
})
// GET - Show
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }else {
            res.render("show", {blog: blog});
        }
    })
})
// GET - Edit
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }else {
            res.render("edit", {blog: blog});
        }
    })
})
// PUT - Update
app.put("/blogs/:id", function(req, res) {
    //console.log(req.body.blog.content);
    req.body.blog.content = req.sanitize(req.body.blog.content);
    //console.log(req.body.blog.content);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
        }else {
            //console.log(blog);
            res.redirect("/blogs/" + req.params.id);
        }
    })
})
// DELETE
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        }else {
            res.redirect("/blogs");
        }
    })
})


app.listen(3000, function() {
    console.log("Server has started!");
})