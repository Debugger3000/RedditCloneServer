import express from 'express';

//main router to 
const router = express.Router();

// import controller functions
import { createThread, getThreads, getThread, getThreadByTitle } from '../controllers/threads.js';

// Post a new thread to collection
router.post('/', createThread);


router.get('/', getThreads);
router.get('/:id', getThread);
router.get('/search/:title', getThreadByTitle);

export default router;