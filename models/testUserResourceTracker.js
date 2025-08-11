// Require the mongoose module
import mongoose from "mongoose";

const testUserResourceTrackerSchemaObject = new mongoose.Schema(
  {
    firebaseUploads: {
      type: Number,
      required: true,
      default: 0,
    },

    // COMMENTS resources
    postComment: {
      type: Number,
      required: true,
      default: 0,
    },
    putComment: {
      type: Number,
      required: true,
      default: 0,
    },
    deleteComment: {
      type: Number,
      required: true,
      default: 0,
    },

    // POSTS
    postPost: {
      type: Number,
      required: true,
      default: 0,
    },

    // THREADS
    postThread: {
      type: Number,
      required: true,
      default: 0,
    },
    patchThread: {
      type: Number,
      required: true,
      default: 0,
    },

    // PROFILE - should be patch or put...
    postProfile: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const TestUserResourceTracker = mongoose.model(
  "TestUserResourceTracker",
  testUserResourceTrackerSchemaObject
);

export { TestUserResourceTracker };
