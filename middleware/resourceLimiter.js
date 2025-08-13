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
const limit = 2;

const paths = {
  "/api/comments": {
    POST: "postComment",
    PUT: "putComment",
    DELETE: "deleteComment",
  },
  "/api/post": {
    POST: "postPost",
  },
  "/api/threads": {
    POST: "postThread",
    PATCH: "patchThread",
  },
  "/api/user/edit-profile": {
    POST: "postProfile",
  },
};

function findMatch(fullPath, method) {
  // 1. Look for the first key that is contained in the fullPath string
  const matchedKey = Object.keys(paths).find((key) => fullPath.includes(key));

  if (matchedKey) {
    // 2. Check if the method exists for that key
    if (paths[matchedKey][method]) {
      return paths[matchedKey][method];
    }
  }
  return null;
}

// multiple people using this account. Will the limits be enough for daily use ?
//  should I have two test User accounts ?

export async function checkUserIdentityResourceLimiter(req, res, next) {
  // we want to avoid any GET / read routes

  console.log("Checking for resource limiter");

  const path = req.path;
  const method = req.method;

  if (path.includes("vote") || path.includes("join") || method === "GET") {
    console.log("path contains join or vote, so go next. Or path is a GET.");
    return next();
  }

  // check for string match in our path object
  const resultField = findMatch(path, method);
  // console.log("result field is: ", resultField);

  // if a user exists
  if (resultField) {
    console.log("Resource limiter running");
    // console.log("req user ", req.user);
    // console.log("Path: ", req.path);

    const user_id = req.user._id;

    // check if user id is the same as testUser documents id
    const testUser = await TestUserResourceTracker.findOne({
      testUserId: user_id,
    });

    console.log("test user: ", testUser);
    // if TestUser is null or empty, then we need to go next
    if (!testUser) {
      return next();
    }

    // check if its a new day, to reset all the values to zero before trying to increment or check values
    const resourceDocument = await checkResetDate(testUser, user_id);

    // console.log("check reset returned doc value: ", resourceDocument);

    // console.log("Path for route just hit: ", path);
    // console.log("Method for route just hit: ", method);

    // logic with returned result of increment on some field in resource Document
    const result = await incrementSomeResource(
      resourceDocument,
      resultField,
      user_id
    );
    console.log("result of increment logic: ", result);

    // check return status of increment function
    // we do this B/C we have to return from within this function...
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
async function incrementSomeResource(resourceDocument, type, user_id) {
  // match type with key field of the document

  const doc = resourceDocument.toObject();
  for (const key in doc) {
    if (key === type) {
      const value = doc[key];
      if (value < limit) {
        console.log("added field to increment field, ", type);
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
  const updatedDoc = await TestUserResourceTracker.findOneAndUpdate(
    { testUserId: user_id },
    { $inc: { [type]: 1 } },
    { returnDocument: "after" } // returns the updated document
  );

  // console.log("updated doc after increment: ", updatedDoc);

  if (updatedDoc) {
    console.log(`Successfully increment resource limiter for field: ${type}`);
    return { status: true, message: `Successful increment for ${type}` };
  } else {
    return { status: false, message: "" };
  }
}

async function resetResourceFields(id) {
  const newResetDoc = await TestUserResourceTracker.findOneAndUpdate(
    { testUserId: id },
    {
      $set: {
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
  console.log("A resource limit document has been reset");
  return newResetDoc;
}

// checks whether the given document can be reset
// RETURNS - new updated document with fields reset or document that it was given
async function checkResetDate(resourceDocument, user_id) {
  const updated = new Date(resourceDocument.updatedAt);
  const curDate = new Date();

  if (updated.getFullYear() < curDate.getFullYear()) {
    // year ahead reset fields
    return await resetResourceFields(user_id);
  } else {
    // month is ahead, reset
    if (updated.getMonth() < curDate.getMonth()) {
      return await resetResourceFields(user_id);
    }
    // check days now...
    else {
      if (updated.getDate() < curDate.getDate()) {
        // day is ahead, reset
        return await resetResourceFields(user_id);
      } else {
        return resourceDocument;
      }
    }
  }
}
