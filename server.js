// -------------------------
// general server imports
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv';

import passport from './middleware/Authentication.js';

// Routes import
import userRouter from './routes/user.js';
import threadRouter from './routes/threads.js';
import postRouter from './routes/post.js';


// -----------------
// Set environment files based on script start
dotenv.config({path: `./.env.${process.env.NODE_ENV}`});
// log out environment type
console.log("Environment: ",process.env.NODE_ENV);


// general variables
const port = 8080;

// initialize base of express app
const app = express();


// some middle ware for app to use
app.use(express.json());
app.use(cookieParser());

// Sessions
const sessionObject = {
    store: connectMongo.create({
        mongoUrl: `${process.env.MONGO_CONNECTION}`,
        //touchAfter: 24 * 3600, // update session when touched only once every 24 hours
        collectionName: 'RedditCloneSessions',
    }),
    name: 'RedditCloneCookie',
    secret: 'fakeSecret',
    saveUninitialized: false,
    resave: false,

    cookie: {
        maxAge: 3600000
    }
}
app.use(expressSession(sessionObject));


app.use(passport.initialize());
// 
app.use(passport.session());

passport.serializeUser((user,done) => {
  console.log("Serializing");
  done(null,user);
});

passport.deserializeUser((user,done) => {
  console.log('Deserializing');
  done(null,user);
})






// MONGO DB connection...
// mongodb+srv://Carter:weBHook34^5@redditclonecartier.8eovm.mongodb.net/?retryWrites=true&w=majority&appName=RedditCloneCartier
//mongo connection
mongoose
.connect(process.env.MONGO_CONNECTION)
.then(() => { console.log('connected to mongo DB for Reddit clone !');})
.catch((err) => {console.log('Error:',err);});


// Routes
app.use('/api/user', userRouter);
app.use('/api/thread', threadRouter);
app.use('/api/post', postRouter);

// listen to a port
app.listen(port, () => {
    console.log("Listening on port 8080");
});


export { passport }