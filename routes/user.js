import express from 'express';
import passport from 'passport';


//main router to 
const router = express.Router();

// import controller functions
import { usersGet, userLogin, userRegister, userLogout, isAuthenticated, userGet } from '../controllers/users.js';


// routes for /user to hit
router.get('/', usersGet);
router.get('/:id', userGet);


router.post('/login', userLogin);
router.post('/register', userRegister);
router.post('/logout', userLogout);
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),

        // if successful this gets called...
        function(req, res) {
          // Successful authentication, redirect home.
          console.log("github authentication has been successful...");
          console.log("Current req user from github auth: ", req.user);

            // res.redirect(`/home/${req.user._id}`);
            res.redirect('/home');
        }
);
router.get('/auth/github',
    passport.authenticate('github')
);

// check if user auth
router.post('/isAuth', isAuthenticated);



export default router;
// module.exports = router;


