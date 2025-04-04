import { Thread } from "../models/threads.js";


const createThread = async (req,res) => {
    console.log("Create thread route hit");
    try{
        const {title, bio, links} = req.body;

        const thread = new Thread({
            title: title,
            bio: bio,
            links: links
        });

        await thread.save();

        res.status(200).json({message: 'thread created'});
    }
    catch (error) {
        console.log("Error in thread Create: ", error);
        res.status(500).json({message: "Error in create thread controller"});
    }
}


export { createThread }

