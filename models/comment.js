import mongoose from 'mongoose';


const commentSchemaObject = {
    commentText: {
        type: String,
        required: true
    },

    // What this comment is on. Either a thread or a comment
    // ID of either a User or a Thread
    parent: {
        type: String
    },

    // Ref to user whos comment this is
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },

    // children of this comment, people who comment on this comment
    childrenComments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    timestamp: true
}

const commentSchema = mongoose.Schema(commentSchemaObject);

const Comment= mongoose.model('Comment',commentSchema);

export {Comment, commentSchema}