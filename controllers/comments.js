import { Comment } from "../models/comment.js"
import { Post } from "../models/posts.js";


const createComment = async (req,res) => {
    console.log("Create Comment route hit");
    try{
        const {parentThread, parentComment, commentText, owner, ownerUserName, ownerPicture} = req.body;

        const comment = new Comment({
            parentThread: parentThread,
            parentComment: parentComment,
            commentText: commentText,
            owner: owner,
            ownerUserName: ownerUserName,
            ownerPicture: ownerPicture
        });


        await comment.save();

        // increment post comment count since comment successfully saved...
        await Post.findByIdAndUpdate(
            parentThread,
            { $inc: { commentCount: 1 } }, 
            { new: true } 
        );


        res.status(200).json({comment});
    }
    catch (error) {
        console.log("Error in comment Create: ", error);
        res.status(500).json({message: "Error in create comment controller"});
    }
}




const getComments = async (req,res) => {
    console.log("get Comments route hit");
    try{

        const comments = await Comment.find().sort({ createdAt: 1 }); 

        // clean comment data so it is not flat when it reaches frontend, and front can focus on display
       

        // iterate from length to index 0. Gradually, adding children to parents children array
        // as newest comments, can't have any children
        // mutate original array, since we need to hold parents in case of other children...
        // for(let i = comments.length - 1; i >= 0; i--) {
        //     // grab child to check for parents...
        //     console.log("i: ",i);

        //     // check for parents
        //     // start at parent - 1
        //     for(let j = i-1; j >= 0; j--){
        //         console.log("j: ",j);
        //         // compare i and tracker which i+1 index
        //         let parent = comments[j]._id.toString();
        //         console.log("parent id: ",parent);
        //         let child = 'tehe';
        //         if(comments[i].parentComment){
        //             child = comments[i].parentComment;
        //         }
        //         else{
        //         console.log("child has no parent comment id...");
        //         }
        //         console.log("child id: ",child);
        //         if(parent === child) {
        //             // remove child and add to parents child list
        //             let childSpliced = comments.splice(i,1);
        //             // add child document to parent array
        //             comments[j].childComments.push(childSpliced[0]);
        //         }   
        //     }
        // }
        console.log("----------------------------------------------");
        // console.log("new comment structure: ", comments);
        
        res.status(200).json({comments});
        
    }
    catch (error) {
        console.log("Error in comment get: ", error);
        res.status(500).json({message: "Error in get all comment controller"});
    }
}

const getCommentsByPost = async (req,res) => {
    console.log("get Comments from a post route hit");
    
    try{

        const comments = await Comment.find({parentThread: req.params.id}).sort({ createdAt: 1 }); 

        for(let i = comments.length - 1; i > 0; i--) {
            // grab child to check for parents...
            console.log("i: ",i);

            // check for parents
            // start at parent - 1
            for(let j = i-1; j >= 0; j--){
                console.log("j: ",j);
                // compare i and tracker which i+1 index
                let parent = comments[j]._id.toString();
                console.log("parent id: ",parent);
                let child = 'tehe';
                // console.log("comment: ",comments[i]);
                if(comments[i].parentComment){
                    child = comments[i].parentComment;
                }
                else{
                console.log("child has no parent comment id...");
                }
                console.log("child id: ",child);
                if(parent === child) {
                    // remove child and add to parents child list
                    let childSpliced = comments.splice(i,1);
                    // add child document to parent array
                    comments[j].childComments.push(childSpliced[0]);
                    break;
                }   
            }
        }
        
        res.status(200).json(comments);
    }
    catch (error) {
        console.log("Error in get comments by post get: ", error);
        res.status(500).json({message: "Error in get all comments from post controller"});
    }
}

export { createComment, getComments, getCommentsByPost }