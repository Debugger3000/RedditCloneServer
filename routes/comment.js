import express from "express";

//main router to
const router = express.Router();

// import controller functions
import {
  createComment,
  getComments,
  getCommentsByPost,
  commentVote,
  deleteComment,
  editComment,
} from "../controllers/comments.js";

// Post a new thread to collection
router.post("/", createComment);
router.get("/", getComments);

router.post("/vote", commentVote);
// id given by req body for some reason lol
router.put("/", editComment);

router.get("/:id", getCommentsByPost);
router.delete("/:id", deleteComment);

export default router;
