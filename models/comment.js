import mongoose from 'mongoose';

const commentSchemaObject = new mongoose.Schema({
    commentText: {
        type: String,
        required: true
    },

    // grab all comments without a parent comment first, and then grab their children

    // id of a parent thread...
    // allow easy query of all comments pertaining to this thread
    parentThread: {
        type: String
    },

    // ID of parent comment
    // null if it has no parent comment
    parentComment: {
        type: String,
        default: null
    },

    // add child comments to this array
    childComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }],

    // Ref to user whos comment this is
    // add owner id, pic, username on comment creation
    // id of user
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },

    // owner Profile Picture
    ownerPicture: {
        type: String
    },

    // owner username
    ownerUserName: {
        type: String
    },

    // children of this comment, people who comment on this comment
    // childrenComments: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },

    // calculate difference on front end (6 hrs ago, 2 wks ago, 1 yr ago)
   
}, { timestamps: true })

// const commentSchema = mongoose.Schema(commentSchemaObject);

const Comment= mongoose.model('Comment',commentSchemaObject);

export {Comment}