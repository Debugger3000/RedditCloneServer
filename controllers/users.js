import { User } from "../models/users.js";
import passport from "passport";
import { deleteObject, ref } from "firebase/storage";
import { deleteFirebaseImage, storage } from "../middleware/firebase.js";

// controllers
// ----------------------------------------

const usersGet = async (req, res) => {
  console.log("usersGet route /api/user has been hit");
  try {
    // grab all users
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in usersGet: ", error);
    res.status(500).json({ message: "Error in usersGet controller" });
  }
};

const userGet = async (req, res) => {
  console.log("userGet route /api/user has been hit");
  try {
    console.log("id on params.id: ", req.params.id);
    // grab all users
    const user = await User.findById(req.params.id).select("-profileImagePath");
    // console.log("user grabbed in userGET: ",user);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in userGet: ", error);
    res.status(500).json({ message: "Error in userGet controller" });
  }
};

// Logout
const userLogout = (req, res) => {
  console.log("logout has been called....");
  req.logout(function (err) {
    console.log("User has been logged out...");
    console.log("Req.user status: ", req.user);
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logout received..." });
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
const userRegister = function (req, res, next) {
  console.log("userRegister POST has been hit");
  console.log(req.body);
  passport.authenticate("register", async (err, user, info) => {
    console.log("err", err);
    console.log("user", user);
    console.log("info: ", info);

    try {
      if (!user) {
        res
          .status(500)
          .json({ status: false, email: info.email, username: info.username });
      }
      // if user exists then auth is fine, so we log the user in...
      else {
        req.login(user, async (error) => {
          console.log("User logged in !");
          console.log("Is User Authenticated: ", req.isAuthenticated());
          res.status(200).json({ status: true });
        });
      }
    } catch (error) {
      console.log("Error in user registry: ", error);
      res.status(500).json({ status: false });
    }
  })(req, res, next);
};

// LOGIN - login an existing user
const userLogin = function (req, res, next) {
  console.log("userLogin POST has been hit");
  console.log(req.body);

  passport.authenticate("login", async (err, user, info) => {
    console.log("err", err);
    console.log("user", user);
    console.log("info: ", info);

    try {
      if (!user) {
        res.status(500).json({ status: false });
      }
      // error happened during register authentication
      else if (err) {
        res.status(500).json({ status: false });
      }
      // if user exists then auth is fine, so we log the user in...
      else {
        req.login(user, async (error) => {
          console.log("User logged in !");
          console.log("Is User Authenticated: ", req.isAuthenticated());
          res.status(200).json({
            status: true,
            username: user.username,
            _id: user._id,
            profileImage: user.profileImage,
            votes: user.votes,
            voteOnComments: user.voteOnComments,
          });
        });
      }
    } catch (error) {
      console.log("Error in user login: ", error);
      res.status(500).json({ status: false });
    }
  })(req, res, next);
};

const isAuthenticated = async (req, res) => {
  try {
    console.log("Checking user auth has been hit");
    if (req.user) {
      console.log("User auth status: Good");
      console.log("user object: ", req.user);
      // console.log("user object: ", req);

      // grab data when we check, cause data may have been updated...
      const user = await User.findById(req.user._id).select(
        "-profileImagePath"
      );

      res.status(200).json(user);
    } else {
      console.log("User auth status: Bad");
      res.status(404).json({ status: false, userId: null, username: null });
    }
  } catch (error) {
    console.log("Error in Authentication: ", error);
    res.status(500).json({ status: false, userId: null, username: null });
  }
};

const editProfile = async (req, res) => {
  console.log("edit profile route /api/user has been hit");
  try {
    const { profileImage, profileImagePath } = req.body;
    const newUser = {
      profileImage: profileImage,
      profileImagePath: profileImagePath,
    };

    console.log("new user data from edit profile: ", newUser);

    // grab old filePath if there is one...
    const oldUser = await User.findById(req.params.id);

    const filePath = oldUser.profileImagePath;
    console.log("old user image file path: ", filePath);

    if (filePath) {
      try {
        console.log("deleting from firebase storage...");
        // give filePath to firebase delete function...
        await deleteFirebaseImage(filePath);
      } catch (error) {
        console.log("error in edit profile delete image: ", error);
      }
    }
    // delete users old image from firebase since we changed it and dont need it

    // await deleteObject(refer);
    // console.log("deleted old profile image from firebase storage !");

    // update user profile
    const user = await User.findByIdAndUpdate(req.params.id, newUser, {
      new: true,
    }).select("-profileImagePath");

    console.log("new user object after update: ", user);

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in usersGet: ", error);
    res.status(500).json({ message: "Error in usersGet controller" });
  }
};

// ---------------------------

export {
  usersGet,
  userLogin,
  userRegister,
  userLogout,
  isAuthenticated,
  userGet,
  editProfile,
};
