import express from 'express';

//main router to 
const router = express.Router();

// import controller functions
import { createPost, getPosts, getPostsForThread, getPost } from '../controllers/posts.js';

// Post a new thread to collection
router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id', getPostsForThread);
router.get('/single/:id', getPost);


export default router;