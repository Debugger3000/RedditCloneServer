import { TestUserResourceTracker } from "../models/testUserResourceTracker.js";

const COOKIE_MAX_AGE = 3 * 24 * 60 * 60 * 1000; // 3 days

// export function refreshSessionCookie(req, res, next) {
//   if (req.isAuthenticated && req.isAuthenticated()) {
//     // Refresh cookie maxAge

//     req.session.cookie.maxAge = COOKIE_MAX_AGE;
//   }
//   next();
// }

// Cookie stuff above. 1 hour lifetime should be fine, only problem is data usage.

// -------------------------------------
// Check user identity, if testUser then we need to check resource tracker document to enforce limits...
const limit = 3;
const deleteLimit = 2;

// multiple people using this account. Will the limits be enough for daily use ?
//  should I have two test User accounts ?

export async function checkUserIdentityResourceLimiter(req, res, next) {
  // we want to avoid any GET / read routes

  // if a user exists
  if (req.user && req.method != "GET") {
    // check if user id is the same as testUser documents id
    const testUser = await TestUserResourceTracker.findById(req.user._id);

    // check if its a new day, to reset all the values to zero before trying to increment or check values
    const resourceDocument = await checkResetDate(testUser);

    const path = req.path;
    const method = req.method;

    // field to increment variable
    let fieldToIncrement = "";

    console.log("Path for route just hit: ", path);
    console.log("Method for route just hit: ", method);

    //   COMMENTS
    if (path.startsWith("/api/comment")) {
      if (method === "POST") {
        //   POST - create comment route - '/api/comment'
        fieldToIncrement = "postComment";
      } else if (method === "PUT") {
        //   PUT - edit comment route - '/api/comment'
        fieldToIncrement = "putComment";
      } else if (method === "DELETE") {
        //   DELETE - delete a comment route - '/api/comment/:id'
        fieldToIncrement = "deleteComment";
      }
    }
    //   POSTS
    else if (path.startsWith("/api/post")) {
      if (method === "POST") {
        //   POST - create post route - '/api/post'
        fieldToIncrement = "postPost";
      }
    }
    // THREADS
    else if (path.startsWith("/api/thread")) {
      if (method === "POST") {
        //   POST - create thread route - '/api/thread'
        fieldToIncrement = "postThread";
      } else if (method === "PATCH") {
        //   PATCH - edit thread route - '/api/thread/:id'
        fieldToIncrement = "patchThread";
      }
    }
    //   PROFILE
    else if (path.startsWith("/api/user/edit-profile")) {
      //   edit profile route - '/api/user/edit-profile/:id'
      fieldToIncrement = "postProfile";
    }

    // logic with returned result of increment
    const result = await incrementSomeResource(
      resourceDocument,
      fieldToIncrement
    );
    if (!result.status && result.message.length > 0) {
      return res.status(404).json({
        status: false,
        message: result.message,
      });
    } else if (!result.status) {
      return res.status(500).json();
    } else {
      return next();
    }
  } else {
    // user checks out, pass control to router...
    return next();
  }
}

// helper functions for resource limiter
// ------------------------------

// increment the given document for whatever field...
// reset all or increment a field
async function incrementSomeResource(resourceDocument, type) {
  // match type with key field of the document
  const incrementField = {};
  for (const [key, value] of Object.entries(resourceDocument)) {
    if (key === type) {
      if (value < limit) {
        incrementField[key] = value + 1;
        break;
      }
      // limit is already reached...
      else {
        return {
          status: false,
          message: `${type} has reached its daily limit!`,
        };
      }
    }
  }

  const updatedDoc = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: incrementField }
  );

  if (updatedDoc.ok) {
    console.log(`Successfully increment resource limiter for field: ${type}`);
    return { status: true, message: "" };
  } else {
    return { status: false, message: "" };
  }
}

async function resetResourceFields(id) {
  const newResetDoc = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        firebaseUploads: 0,
        postComment: 0,
        putComment: 0,
        deleteComment: 0,
        postPost: 0,
        postThread: 0,
        patchThread: 0,
        postProfile: 0,
      },
    },
    { returnDocument: "after" } // returns the updated document
  );
  return newResetDoc;
}

// checks whether the given document can be reset
// RETURNS - new updated document with fields reset or document that it was given
async function checkResetDate(resourceDocument) {
  const updated = new Date(resourceDocument.updatedAt);
  const curDate = new Date();

  if (updated.getFullYear() < curDate.getFullYear()) {
    // year ahead reset fields
    return await resetResourceFields(resourceDocument._id);
  } else {
    // month is ahead, reset
    if (updated.getMonth() < curDate.getMonth()) {
      return await resetResourceFields(resourceDocument._id);
    }
    // check days now...
    else {
      if (updated.getDate() < curDate.getDate()) {
        // day is ahead, reset
        return await resetResourceFields(resourceDocument._id);
      } else {
        return resourceDocument;
      }
    }
  }
}
