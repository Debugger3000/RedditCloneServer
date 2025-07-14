// Require the mongoose module
import mongoose from "mongoose";

// model to hold user data that relates to user, in a secondary way
// since we want to keep User schema as strict to authorization data as possible
// username, password, picture, _id
// Stuff that relates directly to the users account details

// CREATION -- create this schema when a user is created, or create new one if one doesn't exist for user yet...

const userDataSchemaObject = {
  // _id of this object itself

  // id reference to user to be able to find this schema
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // User who creates the thread will be the first one to be added to the thread...
    required: true,
  },

  // holds stack of most recent threads visited
  // updates whenever the user clicks on a thread
  // sorted by: most recent, on top / first --- STACK
  //
  recentThreads: {
    // _id for this object

    threadIdList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
        // User who creates the thread will be the first one to be added to the thread...
      },
    ],
    default: [],
  },
};

const userDataSchema = mongoose.Schema(userDataSchemaObject);

const UserData = mongoose.model("UserData", userDataSchema);

export { UserData, userDataSchema };

// Defining User model
// export const User = mongoose.model('User', userSchema);
