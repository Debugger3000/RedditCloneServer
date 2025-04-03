import { User } from "../models/users.js";
import passport from "passport";



// controllers
// ----------------------------------------

const usersGet = async (req,res) => {
    console.log("usersGet route /api/user has been hit");
    try{
        // grab all users
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.log("Error in usersGet: ", error);
        res.status(500).json({message: "Error in usersGet controller"});
    }
}


// Logout 
const userLogout = (req, res) => {
    console.log("logout has been called....");
  req.logout(function(err) {
    console.log("User has been logged out...");
    console.log("Req.user status: ", req.user);
    if (err) { return next(err); }
    res.status(200).json({message: "Logout received..."})
  });
};


// login
// const userLogin = async (req,res) => {
//     const { email, password } = req.body;
//     console.log("userLogin POST has been hit");
//     console.log("username: ", email);
//     console.log("password: ", password);

//     try{
//         // grab all users
//         // const users = await User.find();
//         res.status(200).json({status: true});
//     }
//     catch (error) {
//         console.log("Error in usersGet: ", error);
//         res.status(500).json({status: false});
//     }
// }

// Register User
const userRegister = function (req,res,next) {
    console.log("userRegister POST has been hit");
    console.log(req.body);
    passport.authenticate("register", async (err,user,info) =>{

        console.log("err",err);
        console.log("user",user);
        console.log("info: ",info);

    try{
        if(!user) {
            res.status(500).json({status: false});
        }
        // error happened during register authentication
        else if(err){
            res.status(500).json({status: false});
        }
        // if user exists then auth is fine, so we log the user in...
        else{
            req.login(user, async (error) => {
                console.log("User logged in !");
                console.log('Is User Authenticated: ', req.isAuthenticated());
                res.status(200).json({status: true});
            });
        }
    }
    catch (error) {
        console.log("Error in user registry: ", error);
        res.status(500).json({status: false});
    }
    })(req,res,next);
}




// LOGIN - login an existing user
const userLogin = function (req,res,next) {
    console.log("userLogin POST has been hit");
    console.log(req.body);

        passport.authenticate("login", async (err,user,info) => {

            console.log("err",err);
            console.log("user",user);
            console.log("info: ",info);

            try{
                if(!user) {
                    res.status(500).json({status: false});
                }
                // error happened during register authentication
                else if(err){
                    res.status(500).json({status: false});
                }
                // if user exists then auth is fine, so we log the user in...
                else{
                    req.login(user, async (error) => {
                        console.log("User logged in !");
                        console.log('Is User Authenticated: ', req.isAuthenticated());
                        res.status(200).json({status: true});
                    });
                }
            }
            catch (error) {
                console.log("Error in user login: ", error);
                res.status(500).json({status: false});
            }

        })(req,res,next);
    }


















// ---------------------------

export { usersGet, userLogin, userRegister, userLogout }