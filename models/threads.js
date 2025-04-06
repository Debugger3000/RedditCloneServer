
// Require the mongoose module 
import mongoose from 'mongoose';



// sub reddit
const threadSchemaObject = {
    title: {
        type: String,
        required: true,
    },

    // Main image for thread...
    threadImage: {
        type: Number
    },

    bio: {
        type: String
    },
    // links that the thread has to other platforms (youtube, twitch....)
    links: {
        type: [String]
    },

    // Users who exist within the thread
    followers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        // User who creates the thread will be the first one to be added to the thread...
        required: true
    }],

    // Posts within this thread
    posts: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
    }],
    // increment by one when user is added so we dont have to iterate array to get count
    followersCount: {
        type: Number
    }

}

const threadSchema = mongoose.Schema(threadSchemaObject);

const Thread = mongoose.model('Thread',threadSchema);

export {Thread, threadSchema}