import { User } from "../models/users.js";
import passport from "passport";
import { deleteObject, ref } from "firebase/storage";
import {
  deleteFirebaseImage,
  deleteImageStorage,
  imageStorageUpload,
  deleteImageStores,
} from "../middleware/firebase.js";

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
      // console.log("user object: ", req.user);
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
  let newExposedUrlFailure = "";
  let isDocUpdateSuccessful = false;
  let isImageStorageSuccessful = false;
  try {
    // profileImage is imageType
    const { profileImage, profileImagePath } = req.body;

    // profileImage is imageType

    // grab old filePath if there is one...
    const oldUser = await User.findById(req.params.id);

    const oldImageUrl = oldUser.profileImage;

    // -------------------
    // UPload new image first
    // profileImage is imageType (jpg/gif/etc...)
    const newExposedImageUrl = await imageStorageUpload(
      profileImage,
      profileImagePath
    );

    // if DB image storage document fails, we need to delete firebase image and return 500
    if (!newExposedImageUrl) {
      // firebase delete
      await deleteFirebaseImage(profileImagePath);
      return res.status(500).json({
        message: "Error in edit profile, imageStorageUpload",
      });
    } else {
      // set this in case of failure
      isImageStorageSuccessful = true;
      newExposedUrlFailure = newExposedImageUrl;
      oldUser.profileImage = newExposedImageUrl;
    }

    await oldUser.save();
    // check flag so we know user data was updated successfully
    isDocUpdateSuccessful = true;

    // ------------
    // Delete old data after new data was created successfully
    // if old image url exists then delete relevant files
    if (oldImageUrl) {
      await deleteImageStores(oldImageUrl);
    }

    res.status(200).json(oldUser);
  } catch (error) {
    // If data didnt persist onto user profile, then we delete firebase / mongo image records...
    if (!isImageStorageSuccessful) {
      await deleteFirebaseImage(threadImagePath);
    }
    // we need to delete both image stores (firebase and mongodb imageStore document)
    else if (!isDocUpdateSuccessful) {
      await deleteImageStores(newExposedUrlFailure);
    }

    console.log("Error in usersGet: ", error);
    res.status(500).json({ message: "Error in edit profile controller" });
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
