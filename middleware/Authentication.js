import passport from "passport";
import LocalStrategy from "passport-local";
import encrypt from "bcrypt";
import { User } from "../models/users.js";
import GitHubStrategy from "passport-github";
import axios from "axios";

import dotenv from "dotenv";

// var GitHubStrategy = require('passport-github').Strategy;

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

console.log("middle ware file has run...");

console.log("clientId: ", process.env.GITHUB_CLIENT_ID);
console.log("CALLBACK: ", process.env.GITHUB_CALLBACK);

// github
passport.use(
  new GitHubStrategy.Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
      scope: ["user:email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log("inside github auth");
      console.log("Github profile object: ", profile);

      try {
        // try to find the user with username
        const user = await User.findOne({ username: profile.username });

        console.log(
          "Trying to find github username in collection, we found: ",
          user
        );

        // user is found log them in
        if (user) {
          console.log(
            "User found with github username, logging github account in now... with cb"
          );
          return cb(null, user);
        }
        // user is not found, so create account with github credentials
        else {
          const response = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const primaryEmail = response.data.find(
            (email) => email.primary
          ).email;
          console.log("github primary email: ", primaryEmail);
          const newUser = new User({
            email: primaryEmail,
            username: profile.username,
            password: profile.id,
          });

          console.log("Github user created based off of github profile...");

          await newUser.save();
          return cb(null, newUser);
        }
      } catch (error) {
        console.log("Error is github auth strategy... ", error);
        return cb(error, null);
      }

      // check hashed password

      // if null, then create a user account for them instead
      // if(!user){
      //   const newUser = new User({email: email, username: req.body.username, password: hashedPassword})
      // }

      // User.findOrCreate({ githubId: profile.id },

      // function (err, user) {
      //   return cb(err, user);
      // };
    }
  )
);

// Register code here...

// Register Code
passport.use(
  "register",
  new LocalStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        //check to make sure your email does not exist in the database
        let emailCheck = await User.findOne({ email });
        console.log(emailCheck);
        if (emailCheck != null) {
          return done(null, false, { status: false, email: 0, username: 0 });
        }

        let username = req.body.username;
        console.log("username choosen: ", username);
        let usernameCheck = await User.findOne({ username });
        if (usernameCheck != null) {
          return done(null, false, { status: false, email: 1, username: 0 });
        }
        console.log("user found with username....", usernameCheck);

        //hash password received from frontend with 10 salt rounds
        let hashedPassword = await encrypt.hash(password, 10);

        let user = new User({
          email: email,
          username: req.body.username,
          password: hashedPassword,
        });
        // commit data to DB
        await user.save();

        return done(null, user, { status: true, email: 1, username: 1 });

        // call done and user should be logged in from here
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Set strategy to use
passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        let user = await User.findOne({ email });

        if (!user) {
          console.log("user is not found....");
          return done(null, false, {
            message: "User not found in Database!",
            success: false,
            url: "",
            id: "",
            code: "unf",
          });
        }

        console.log("user object in login...", user.password);

        let isCorrectPassword = await encrypt.compare(password, user.password);
        console.log("is correct password : ", isCorrectPassword);

        if (isCorrectPassword) {
          return done(null, user, {
            message: "User found, and is going to be logged...",
          });
        } else {
          return done(null, false, {
            message: "Password did not match!",
            success: false,
            url: "",
            id: "",
            code: "npm",
          });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
