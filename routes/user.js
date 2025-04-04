import express from 'express';

//main router to 
const router = express.Router();

// import controller functions
import { usersGet, userLogin, userRegister, userLogout, isAuthenticated } from '../controllers/users.js';


// routes for /user to hit
router.get('/', usersGet);


router.post('/login', userLogin);
router.post('/register', userRegister);
router.post('/logout', userLogout);

// check if user auth
router.post('/isAuth', isAuthenticated);



export default router;
// module.exports = router;


