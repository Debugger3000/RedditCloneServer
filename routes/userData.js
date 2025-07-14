import express from "express";

//main router to
const router = express.Router();

// import controller functions
import {
  getUserRecentThreads,
  updateRecentThreads,
} from "../controllers/userData.js";

// Post a new thread to collection
router.get("/recentThreads", getUserRecentThreads);
router.post("/recentThreads", updateRecentThreads);

export default router;
