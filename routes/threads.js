import express from 'express';

//main router to 
const router = express.Router();

// import controller functions
import { createThread, getThreads, getThread, getThreadByTitle, joinThread, deleteThread, editThread, getThreadsByUser } from '../controllers/threads.js';

// Post a new thread to collection
router.post('/', createThread);
router.post('/join/:id', joinThread);

router.patch('/:id', editThread);

router.delete('/:id', deleteThread);


router.get('/', getThreads);
router.get('/:id', getThread);
router.get('/search/:title', getThreadByTitle);
router.get('/user/ya', getThreadsByUser);

export default router;