const express = require("express");
const router = express.Router();
const Blog = require("../models/bloging");
const upload = require("../config/multer");


router.get("/", async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        res.render("blog/blogs", { blogs: allBlogs });
    } catch (err) {
        console.log(err);
        res.send("Error fetching blogs");
    }
});



//new blog
router.get("/new", (req, res) => {
    res.render("blog/new");
});



// POST new blog
router.post("/", upload.single("imageFile"),async(req,res)=>{
    try{
        let image;
            if(req.file){ 
                image = req.file.path;
            }
            else if(
                req.body.imageUrl &&
                req.body.imageUrl.trim()
            )
            { 
                image = req.body.imageUrl; 
            }
            else{
                image = "/images/default-blog.jpg";
            }

        const blog = new Blog({
            title: req.body.title,
            topic: req.body.topic,
            description: req.body.description,
            content: req.body.content,
            image: image,
            tags: req.body.tags.split(",")
                .map(tag=>tag.trim())
        });
         
        await blog.save();
        res.redirect("/home/blogs"); 
    }
    catch(err){
        console.log(err);
        res.send( "Error Saving Blog" );
    }
});



// GET single blog
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("blog/show", { blog });
});



//edit blog
router.get("/:id/edit", async(req,res)=>{
    res.set(
        'Cache-Control',
        'no-store'

    );
    const blog = await Blog.findById(req.params.id);
    res.render("blog/edit", { blog });
});



//update blog
router.put("/:id", upload.single("imageFile"), async(req,res)=>{
    try{
        let image;
        const blog = await Blog.findById(req.params.id);
        if(req.file){
            image = req.file.path;
        }
        else if(req.body.imageUrl?.trim()){
            image = req.body.imageUrl;
        }
        else{
            image = blog.image;
        }

        await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title:req.body.title,
                topic:req.body.topic,
                description:req.body.description,
                content:req.body.content,
                image:image,
                tags:req.body.tags
                    .split(",")
                    .map(tag=>tag.trim())
            }
        );
        res.redirect(`/home/blogs/${req.params.id}`);
    }
    catch(err){
        console.log(err);
    }
});



//delete blog
router.delete("/:id", async(req,res)=>{
    await Blog.findByIdAndDelete(
        req.params.id
    );
    res.redirect("/home/blogs");
});


module.exports = router;