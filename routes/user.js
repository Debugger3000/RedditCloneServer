

// const User = require('../models/user');
// const passport = require('passport');
const express = require('express');
// const encrypt = require('bcryptjs');
//main router to 
const router = express.Router();


// test route
router.get('/', (req,res) => {

    console.log("GET for /api/user has been called !")
    res.status(200).send({message: "Here is your data !"});
});


module.exports = router;


