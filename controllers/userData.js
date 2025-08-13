import { UserData } from "../models/userData.js";
import { Thread } from "../models/threads.js";
import { bucketStorage } from "../middleware/firebase.js";
import { ImageStorage } from "../models/imageUrlStorage.js";

const getUserRecentThreads = async (req, res) => {
  console.log("get user recent threads route hit");
  try {
    // get userData schema object
    if (req.user) {
      const userData = await UserData.findOne({ userId: req.user._id });

      // console.log("userData document in get Recent: ", userData);

      // go through array, and grab each thread in order
      // send array, return sorted threads...
      if (!userData || userData.length == 0) {
        const newUserData = new UserData({
          userId: req.user._id,
        });

        await newUserData.save();

        res.status(200).json({ threadList: [] });
      } else {
        // console.log("userData in get Recent: ", userData.recentThreads);
        const sortedThreads = await findRecentThreadsSort(
          userData.recentThreads.threadIdList
        );
        res.status(200).json(sortedThreads);
      }
    } else {
      res.status(200).json({ threadList: [] });
    }

    console.log("----------------------------------------------");
  } catch (error) {
    console.log("Error in get users recent threads: ", error);
    res
      .status(500)
      .json({ message: "Error in get user recent threads controller" });
  }
};

const updateRecentThreads = async (req, res) => {
  console.log("update user recent threads route hit");
  try {
    const { threadId } = req.body;
    // get userData schema object
    const userData = await UserData.findOne({ userId: req.user._id });

    // add threadId to list of recent threads
    let copy = [...userData.recentThreads.threadIdList];

    const index = copy.findIndex((id) => id == threadId);
    // console.log("index from duplicate search: ", index);
    if (index !== -1) {
      // console.log("duplicates found");
      copy.splice(index, 1);
      copy.unshift(threadId);
    } else {
      // console.log("no duplicates found, add single thread id", threadId);
      copy.unshift(threadId);
    }
    // check  length
    if (copy.length > 5) {
      // remove 6th item
      copy.pop();
    }

    // console.log("updated array: ", copy);

    // update userData
    await UserData.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { "recentThreads.threadIdList": copy } }
    );

    // send array, return sorted threads...
    // const sortedThreads = await findRecentThreadsSort(copy);

    console.log("----------------------------------------------");

    res.status(200).json({ message: "update recent threads!" });
  } catch (error) {
    console.log("Error in get users recent threads: ", error);
    res
      .status(500)
      .json({ message: "Error in get user recent threads controller" });
  }
};

// helper function that will grab recent threads in order for user...
async function findRecentThreadsSort(threadIdArray) {
  // go through array
  //  [1,2,3,4,5]
  // grab documents by id in array
  // console.log("threadIdArray in sorter: ", threadIdArray);
  const recentThreads = await Thread.find({ _id: { $in: threadIdArray } });

  // sort them, pop each one in order of original array, with while until empty...
  const copy = [...recentThreads];

  let sorted = [];
  for (let i = 0; i < copy.length; i++) {
    // console.log("i: ", i);
    for (let j = 0; j < copy.length; j++) {
      let id = copy[j]._id;
      // console.log("j: ", j);

      // console.log("theadidarray: ", threadIdArray[i]);
      if (threadIdArray[i].toString() == id.toString()) {
        sorted.push(copy[j]);
        // console.log("index match: ", i);
        break;
      }
    }
  }

  console.log("copy after sorted: ", sorted.length);

  return sorted;
}

// route that sends back a signed url for client to upload an image to firebase storage
const firebaseUpload = async (req, res) => {
  console.log("get user recent threads route hit");
  try {
    // const fileName = req.params.fileName;
    // this is actually 'filePath'
    const filePath = req.query.filePath;
    const fileType = req.query.fileType;
    console.log("file type here: ", fileType);

    const bucket = await bucketStorage();
    const file = bucket.file(filePath);

    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write", // signed URL allows upload (PUT)
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: fileType, // e.g., 'image/jpeg'
    });

    console.log("signed url: ", url);
    if (url) {
      // if signed url is good, then create image storage document before returning url.
      // call firebase storage upload...
      // await imageStorageUpload(fileType, filePath);

      res.status(200).json(url);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.log("Error in get users recent threads: ", error);
    res
      .status(500)
      .json({ message: "Error in get user recent threads controller" });
  }
};

// Access point for all images on web app.
// Stream image data from firebase to client res object from here
const imageStorageUpload = async (req, res) => {
  console.log("getting image from secure storage route hit");
  try {
    const id = req.params.id;

    // search for image document
    const imageDocument = await ImageStorage.findById(id);

    if (imageDocument && req.user) {
      // get path, set up stream...
      const bucket = await bucketStorage();
      const file = bucket.file(imageDocument.imagePath);

      const [metaData] = await file.getMetadata();
      const contentType = metaData.contentType;

      res.setHeader("Content-Type", contentType);

      // Stream the image
      const readStream = file.createReadStream();

      // make sure stream is okay
      readStream.on("error", (err) => {
        console.error("Error streaming image from firebase:", err);
        res.sendStatus(404);
      });

      // pipe data to the browser from firebase
      readStream.pipe(res);
    }

    // res.status(200).json(url);
  } catch (error) {
    console.log("Error in get image from storage / firebase...", error);
    res
      .status(500)
      .json({ message: "Error in get image from storage / firebase..." });
  }
};

export {
  getUserRecentThreads,
  updateRecentThreads,
  firebaseUpload,
  imageStorageUpload,
};
