import express from 'express';

//main router to 
const router = express.Router();

// import controller functions
import { usersGet, userLogin, userRegister, userLogout } from '../controllers/users.js';


// routes for /user to hit
router.get('/', usersGet);


router.post('/login', userLogin);
router.post('/register', userRegister);
router.post('/logout', userLogout);



export default router;
// module.exports = router;


