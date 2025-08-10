// Require the mongoose module
import mongoose from "mongoose";

const testUserResourceTrackerSchemaObject = new mongoose.Schema(
  {
    firebaseUploads: {
      type: Number,
      required: true,
      default: 0,
    },

    deletions: {
      type: Number,
      required: true,
      default: 0,
    },
    //
    creations: {
      type: Number,
      required: true,
      default: 0,
    },
    //
    edits: {
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
