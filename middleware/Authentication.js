import passport from 'passport';
import LocalStrategy from 'passport-local';
import encrypt from 'bcrypt';
import { User } from '../models/users.js';


console.log("middle ware file has run...");


// Login code here...









// Register code here...

// Register Code
    passport.use(
        'register',
        new LocalStrategy.Strategy(
          {usernameField: "email", passwordField: "password", passReqToCallback: true},
          async (req,email,password,done) => {
            try {
      
              //check to make sure your email does not exist in the database
              let emailCheck = await User.findOne({ email });
              console.log(emailCheck);
              if(emailCheck != null){
                return done(null,false,{status: false});
              }
      
              //hash password received from frontend with 10 salt rounds
              let hashedPassword = await encrypt.hash(password,10);
              
              let user = new User({email: email, username: req.body.username, password: hashedPassword});
              // commit data to DB
              await user.save();
              // call done and user should be logged in from here
              done(null,user,{status: true});
            }
            
            catch (error) {
              return done(error);
            }
      
          }
        )
      );

// Set strategy to use
passport.use(
    'login',
    new LocalStrategy({usernameField: "email", passwordField: "password"}, async (email,password,done) => {
  
      try {
        let user = await User.findOne({ email });
  
        if(!user){
          console.log('user is not found....');
          return done(null,false, {message: "User not found in Database!", success: false, url: "", id:"", code: "unf"});
        }
  
        console.log("user object in login...",user.password);
  
        let isCorrectPassword = await encrypt.compare(password,user.password);
        console.log("is correct password : ", isCorrectPassword);
  
        if(isCorrectPassword){
          return done(null,user, {message: "User found, and is going to be logged..."});
        }
        else{
          return done(null,false,{message: "Password did not match!", success: false, url: "", id:"", code: "npm"});
        }
      } 
      catch (error) {
        return done(error);
      }
    })
  );




    export default passport;





