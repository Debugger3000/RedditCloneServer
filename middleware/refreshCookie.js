// should set cookies to something very short
// site is not meant to have many users, users visiting will be given log in by me, and controlled thereafter

const COOKIE_MAX_AGE = 3 * 24 * 60 * 60 * 1000; // 3 days

// export function refreshSessionCookie(req, res, next) {
//   if (req.isAuthenticated && req.isAuthenticated()) {
//     // Refresh cookie maxAge

//     req.session.cookie.maxAge = COOKIE_MAX_AGE;
//   }
//   next();
// }
