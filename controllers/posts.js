import { Post } from "../models/posts.js";



const createPost = async (req,res) => {
    console.log("Create Post route hit");
    try{
        const {title, textContent, parentThread, tag, parentThreadImage} = req.body;

        const post = new Post({
            title: title,
            textContent: textContent,
            parentThread: parentThread,
            user: req.user._id,
            tag: tag,
            parentThreadImage: parentThreadImage
        });
        await post.save();
        res.status(200).json({post});
    }
    catch (error) {
        console.log("Error in post Create: ", error);
        res.status(500).json({message: "Error in create post controller"});
    }
}


const getPostsForThread = async (req,res) => {
    console.log("Get posts for a thread route hit");
    try{
        const posts = await Post.find({parentThread: req.params.id});
        res.status(200).json({posts});
    }
    catch (error) {
        console.log("Error in post Create: ", error);
        res.status(500).json({message: "Error in create post controller"});
    }

}

const getPosts = async (req,res) => {
    console.log("Get ALL posts for a thread route hit");
    try{
        const posts = await Post.find()
        
        res.status(200).json({posts});
    }
    catch (error) {
        console.log("Error in post GET ALL POSTS: ", error);
        res.status(500).json({message: "Error in create post controller"});
    }
}


// get post data by ID
const getPost = async (req,res) => {
    console.log("Get post route hit");
    try{
        const post = await Post.findById(req.params.id);
        
        res.status(200).json({post});
    }
    catch (error) {
        console.log("Error in GET POST: ", error);
        res.status(500).json({message: "Error in get post controller"});
    }

}


export { createPost, getPosts, getPostsForThread, getPost }