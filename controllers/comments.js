import { commentHydrate } from "../middleware/hydration/commentHydration.js";
import { generalUserHydration } from "../middleware/hydration/postHydration.js";
import { Comment } from "../models/comment.js";
import { Post } from "../models/posts.js";
import { User } from "../models/users.js";

const createComment = async (req, res) => {
  console.log("Create Comment route hit");
  try {
    const {
      parentThread,
      parentComment,
      commentText,
      owner,
      ownerUserName,
      ownerPicture,
    } = req.body;

    const comment = new Comment({
      parentThread: parentThread,
      parentComment: parentComment,
      commentText: commentText,
      owner: owner,
      ownerUserName: ownerUserName,
      ownerPicture: ownerPicture,
    });

    await comment.save();

    // increment post comment count since comment successfully saved...
    await Post.findByIdAndUpdate(
      parentThread,
      { $inc: { commentCount: 1 } },
      { new: true }
    );

    res.status(200).json({ comment });
  } catch (error) {
    console.log("Error in comment Create: ", error);
    res.status(500).json({ message: "Error in create comment controller" });
  }
};

const getComments = async (req, res) => {
  console.log("get Comments route hit");
  try {
    const comments = await Comment.find().sort({ createdAt: 1 });

    console.log("----------------------------------------------");

    res.status(200).json({ comments });
  } catch (error) {
    console.log("Error in comment get: ", error);
    res.status(500).json({ message: "Error in get all comment controller" });
  }
};

const getCommentsByPost = async (req, res) => {
  console.log("get Comments from a post route hit");

  try {
    const comments = await Comment.find({ parentThread: req.params.id }).sort({
      createdAt: 1,
    });

    // hydrate comment data with users image link
    // get users to hydrate comments with...
    const users = await generalUserHydration(comments);
    // hydrate comment documents with user image data
    const hydratedComments = commentHydrate(users, comments);

    console.log("comments after hydration: ", hydratedComments);

    // Un-flatten comment data structure into a nested structure for viewing...
    for (let i = hydratedComments.length - 1; i > 0; i--) {
      // grab child to check for parents...
      // console.log("i: ",i);

      // check for parents
      // start at parent - 1
      for (let j = i - 1; j >= 0; j--) {
        // console.log("j: ",j);
        // compare i and tracker which i+1 index
        let parent = hydratedComments[j]._id.toString();
        // console.log("parent id: ",parent);
        let child = "tehe";
        // console.log("comment: ",comments[i]);
        if (hydratedComments[i].parentComment) {
          child = hydratedComments[i].parentComment;
        } else {
          //   console.log("child has no parent comment id...");
        }
        // console.log("child id: ",child);
        if (parent === child) {
          // remove child and add to parents child list
          let childSpliced = hydratedComments.splice(i, 1);
          // add child document to parent array
          hydratedComments[j].childComments.push(childSpliced[0]);
          break;
        }
      }
    }

    res.status(200).json(hydratedComments);
  } catch (error) {
    console.log("Error in get comments by post get: ", error);
    res
      .status(500)
      .json({ message: "Error in get all comments from post controller" });
  }
};

const commentVote = async (req, res) => {
  console.log("Comments vote route hit");
  try {
    const { commentId, voteType } = req.body;

    // find comment
    const comment = await Comment.findById(commentId);

    // update posts up or down votes, by incrementing/decrementing based on voteType
    if (voteType) {
      // true type of vote so increment votes on post
      comment.voteCount++;
    } else {
      // subtract but make sure postCount is not 0
      if (comment.voteCount != 0) {
        comment.voteCount--;
      }
    }
    await comment.save();

    // now change user votes array
    // grab user, and we add object to its vote array
    const user = await User.findById(req.user._id);
    if (user) {
      // check to see if user already has object for this post
      const vote = user.voteOnComments.find(
        (item) => item.commentId == commentId
      );
      if (vote) {
        vote.voteType = voteType;
      } else {
        user.voteOnComments.push({ commentId: commentId, voteType: voteType });
      }
    }
    await user.save();
    console.log("users votes array: ", user.voteOnComments);

    res.status(200).json(comment);
  } catch (error) {
    console.log("Error in comment get: ", error);
    res.status(500).json({ message: "Error in get all comment controller" });
  }
};

// delete comment
const deleteComment = async (req, res) => {
  console.log("delete Comment route hit");
  try {
    // const { commentId } = req.body;
    // const comments = await Comment.find().sort({ createdAt: 1 });
    await Comment.findByIdAndUpdate(req.params.id, {
      ownerUserName: "[deleted]",
      commentText: "Comment deleted by user",
      ownerPicture: "",
    });

    console.log("----------------------------------------------");

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.log("Error in comment delete: ", error);
    res.status(500).json({ message: "Error in delete comment controller" });
  }
};

// edit a comment
const editComment = async (req, res) => {
  console.log("edit Comment route hit");
  try {
    const { commentId, commentText } = req.body;
    // const comments = await Comment.find().sort({ createdAt: 1 });
    await Comment.findByIdAndUpdate(commentId, {
      commentText: commentText,
    });

    console.log("tehe test git basic script !");
    console.log("tehe test git basic script  02!");

    console.log("----------------------------------------------");

    res.status(200).json({ message: "comment has been edited !" });
  } catch (error) {
    console.log("Error in comment edit: ", error);
    res.status(500).json({ message: "Error in edit comment controller" });
  }
};

export {
  createComment,
  getComments,
  getCommentsByPost,
  commentVote,
  deleteComment,
  editComment,
};
