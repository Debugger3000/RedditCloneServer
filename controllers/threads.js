import { Thread } from "../models/threads.js";


const createThread = async (req,res) => {
    console.log("Create thread route hit");
    try{
        const {title, bio, links} = req.body;
        const thread = new Thread({
            title: title,
            bio: bio,
            links: links,
            followers: [req.user._id],
            followersCount: 1
        });
        await thread.save();
        res.status(200).json({thread});
    }
    catch (error) {
        console.log("Error in thread Create: ", error);
        res.status(500).json({message: "Error in create thread controller"});
    }
}

const getThreads = async (req,res) => {
    console.log("Get threads hit...");
    try{
        const threads = await Thread.find();
        res.status(200).json(threads);
    }
    catch (error) {
        console.log("Error in thread GET: ", error);
        res.status(500).json({message: "Error in get threads controller"});
    }
}

const getThread = async (req,res) => {
    console.log("Get a single thread hit...");
    try{
        const thread = await Thread.findById(req.params.id);
        res.status(200).json(thread);
    }
    catch (error) {
        console.log("Error in single thread GET: ", error);
        res.status(500).json({message: "Error in get single thread controller"});
    }
}


const getThreadByTitle = async (req,res) => {
    console.log("Get a single thread by title hit...");
    try{
        const threads = await Thread.find({title: { $regex: req.params.title, $options: 'i' }});
        res.status(200).json(threads);
    }
    catch (error) {
        console.log("Error in single thread by title GET: ", error);
        res.status(500).json({message: "Error in get single thread by title controller"});
    }
}


export { createThread, getThreads, getThread, getThreadByTitle }

