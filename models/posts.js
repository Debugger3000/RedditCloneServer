
// Require the mongoose module 
import mongoose from 'mongoose';

const postSchemaObject = {
    title: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        required: true
    },
    parentThread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread', 
        required: true
    },
    image: {
        type: Number
    },

    timestamp: true,

}

const postSchema = mongoose.Schema(postSchemaObject);

const Post= mongoose.model('Post',postSchema);

export {Post, postSchema}