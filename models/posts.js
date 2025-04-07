
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
    image: {
        type: Number
    },

}, { timestamps: true });

// const postSchema = mongoose.Schema(postSchemaObject);

const Post= mongoose.model('Post',postSchemaObject);

export {Post}