// Require the mongoose module
import mongoose from "mongoose";

// sub reddit
const threadSchemaObject = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    // Main image for thread...
    threadImage: {
      type: String,
      default: "",
    },
    // main image path for thread
    threadImagePath: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
    },
    // links that the thread has to other platforms (youtube, twitch....)
    links: {
      type: [String],
    },

    // tags that posts tag their post with
    tags: [
      {
        type: String,
      },
    ],

    // owner of thread (has edit and delete permsissions)
    owner: {
      type: String,
      required: true,
    },

    // Users who exist within the thread
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // User who creates the thread will be the first one to be added to the thread...
        required: true,
      },
    ],

    // Posts within this thread
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    // increment by one when user is added so we dont have to iterate array to get count
    followersCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Thread = mongoose.model("Thread", threadSchemaObject);

export { Thread };
