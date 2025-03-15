// import express from "express";
// import userRoute from './routes/user.js';

const express = require('express');
const cookieParser = require('cookie-parser');

// initialize base of express app
const app = express();
// some middle ware
app.use(express.json());
app.use(cookieParser());

// "type": "module",


// Routes
app.use('/api/user', require('./routes/user'));


// listen to port
const port = 8080;
app.listen(port, () => {
    console.log("Server Started");
    console.log("Listening on port 8080");
});