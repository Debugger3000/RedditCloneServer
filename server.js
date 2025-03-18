// import express from "express";
// import userRoute from './routes/user.js';

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// initialize base of express app
const app = express();
// some middle ware
app.use(express.json());
app.use(cookieParser());

// "type": "module",

// mongodb+srv://Carter:weBHook34^5@redditclonecartier.8eovm.mongodb.net/?retryWrites=true&w=majority&appName=RedditCloneCartier
//mongo connection
mongoose
.connect('mongodb+srv://Carter:weBHook34^5@redditclonecartier.8eovm.mongodb.net/?retryWrites=true&w=majority&appName=RedditCloneCartier')
.then(() => { console.log('connected to mongo DB for Reddit clone !');
})
.catch((err) => {console.log('Error:',err);
});


// Routes
app.use('/api/user', require('./routes/user'));


// listen to port
const port = 8080;
app.listen(port, () => {
    console.log("Server Started");
    console.log("Listening on port 8080");
});