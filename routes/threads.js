import express from 'express';

//main router to 
const router = express.Router();

// import controller functions
import { createThread } from '../controllers/threads.js';

// Post a new thread to collection
router.post('/threads', createThread);


export default router;