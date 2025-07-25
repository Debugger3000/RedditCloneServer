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
router.get("/:id", getCommentsByPost);
router.post("/vote", commentVote);
router.delete("/:id", deleteComment);
router.put("/", editComment);

export default router;
