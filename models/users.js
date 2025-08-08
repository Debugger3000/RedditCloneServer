// Require the mongoose module
import mongoose from "mongoose";

const userSchemaObject = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Main image for user...
  // exposed url to my endpoint for profile image
  profileImage: {
    type: String,
    default: "",
  },
  // Main image for user...
  profileImagePath: {
    type: String,
    default: "",
  },

  // hold user votes.
  // easier than comparing public post votes to each single user, where there is public data
  // used to show whether current user has up or down voted for a particular post...
  votes: [
    {
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
      voteType: {
        type: Boolean,
        required: true,
      },
    },
  ],
  voteOnComments: [
    {
      commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
      voteType: {
        type: Boolean,
        required: true,
      },
    },
  ],
};

const userSchema = mongoose.Schema(userSchemaObject);

const User = mongoose.model("User", userSchema);

export { User, userSchema };

// Defining User model
// export const User = mongoose.model('User', userSchema);
