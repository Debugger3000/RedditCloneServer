
// Require the mongoose module 
import mongoose from 'mongoose';

const postSchemaObject = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        required: true
    },
    // Users who exist within the thread
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        // User who creates the thread will be the first one to be added to the thread...
        required: true
    },
    tag: {
        type: String
    },
    parentThread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread', 
        required: true
    },
    parentThreadTitle: {
        type: String
    },
    parentThreadImage: {
        type: String
    },
    image: {
        type: Number
    },
    // comment tracker, need a comment count on post card view
    commentCount: {
        type: Number
    },
    // owner of post (has edit and delete permsissions)
    owner: {
        type: String,
        required: true
    }

}, { timestamps: true });

// const postSchema = mongoose.Schema(postSchemaObject);

const Post= mongoose.model('Post',postSchemaObject);

export {Post}