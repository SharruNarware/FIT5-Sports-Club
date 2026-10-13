const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const blogingSchema = new Schema({   
    title: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: { 
        type: String ,
        required: true,
    },
   image:{
        type: String,
        default:"/images/default-blog.jpg"
},
    tags: [String],
},
{ 
    timestamps: true
}  
);


blogingSchema.virtual("readTime").get(function(){
    if(!this.content) return 0;
    const text = this.content.replace(/<[^>]*>/g,'');
    const words = text.split(/\s+/).length;
    return Math.ceil(words/200);
});


const Blog = mongoose.model('Blog', blogingSchema);

module.exports = Blog;
