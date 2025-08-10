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

// Check user identity, if testUser then we need to check resource tracker document to enforce limits...

// multiple people using this account. Will the limits be enough for daily use ?
//  should I have two test User accounts ?

export async function checkUserIdentityResourceLimiter(req, res, next) {
  // we want to avoid any GET / read routes

  // if a user exists
  if (req.user && req.method != "GET") {
    // check if user id is the same as testUser documents id
    const testUser = await TestUserResourceTracker.findById(req.user._id);

    const path = req.path;
    const method = req.method;

    console.log("Path for route just hit: ", path);
    console.log("Method for route just hit: ", method);

    return next();
  }

  //   COMMENTS
  //   POST - create comment route - '/api/comment'
  //   PUT - edit comment route - '/api/comment'
  //   DELETE - delete a comment route - '/api/comment/:id'

  //   POSTS
  //   POST - create post route - '/api/post'

  //   THREADS
  //   POST - create thread route - '/api/thread'
  //   PATCH - edit thread route - '/api/thread/:id'

  //   PROFILE
  //   edit profile route - '/api/user/edit-profile/:id'
  else {
    // user checks out, pass control to router...
    return next();
  }
}
