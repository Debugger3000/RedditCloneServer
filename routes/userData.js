import express from "express";

//main router to
const router = express.Router();

// import controller functions
import {
  getUserRecentThreads,
  updateRecentThreads,
  firebaseUpload,
  skeleton,
} from "../controllers/userData.js";

// Post a new thread to collection
router.get("/recentThreads", getUserRecentThreads);
router.patch("/recentThreads", updateRecentThreads);
router.get("/firebase/upload", firebaseUpload);
router.get("/test", skeleton);

export default router;
