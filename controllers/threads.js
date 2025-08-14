import { Thread } from "../models/threads.js";
import {
  imageStorageUpload,
  deleteImageStorage,
  deleteFirebaseImage,
  deleteImageStores,
} from "../middleware/firebase.js";

const createThread = async (req, res) => {
  console.log("Create thread route hit");
  console.log("----------------------------");

  let isImageStorageSuccessful = false;
  let isDocUpdateSuccessful = false;

  try {
    const { title, bio, links, tags, username, threadImage, threadImagePath } =
      req.body;

    let newExposedUrl = "";
    // thread Image is imageType
    if (threadImage && threadImagePath) {
      const newUrl = await imageStorageUpload(threadImage, threadImagePath);

      // if null, we need to delete firebase image
      if (!newUrl) {
        await deleteFirebaseImage(threadImagePath);
        return res.status(500).json({
          message: "Error in create thread, create imageStorageUpload",
        });
      } else {
        isImageStorageSuccessful = true;
        newExposedUrl = newUrl;
      }
    }

    const thread = new Thread({
      title: title,
      bio: bio,
      links: links,
      tags: tags,
      threadImage: newExposedUrl,
      // threadImagePath: threadImagePath,
      followers: [req.user._id],
      followersCount: 1,
      owner: username,
    });
    console.log("new thread object: ", thread);
    await thread.save();
    isDocUpdateSuccessful = true;

    res.status(200).json(thread.toObject());
  } catch (error) {
    const { threadImagePath } = req.body;
    // we only need to delete firebase cause imageStore document not created
    if (!isImageStorageSuccessful) {
      await deleteFirebaseImage(threadImagePath);
    }
    // we need to delete both image stores (firebase and mongodb imageStore document)
    else if (!isDocUpdateSuccessful) {
      await deleteImageStores(newExposedUrlFailure);
    }
    console.log("Error in thread Create: ", error);
    res.status(500).json({ message: "Error in create thread controller" });
  }
};

const editThread = async (req, res) => {
  console.log("Edit thread route hit");
  let newExposedUrlFailure = "";
  let isImageStorageSuccessful = false;
  let isDocUpdateSuccessful = false;
  try {
    const { title, bio, links, tags, threadImage, threadImagePath } = req.body;

    // grab thread document
    const thread = await Thread.findById(req.params.id);

    // do we need to update image
    // check if there is a new image upload...
    if (threadImagePath) {
      // grab old image exposed url
      // grab old filePath if there is one...
      try {
        const threadImageExposedUrl = thread.threadImage;

        // check if there is an existing image url to delete old image files
        if (threadImageExposedUrl) {
          // delete old images (firebase and mongodb imageStores doc)
          await deleteImageStores(threadImageExposedUrl);
        }

        // upload new image
        const newExposedImageUrl = await imageStorageUpload(
          threadImage,
          threadImagePath
        );
        // if null, we need to delete firebase image
        if (!newExposedImageUrl) {
          await deleteFirebaseImage(threadImagePath);
          return res.status(500).json({
            message: "Error in create thread, create imageStorageUpload",
          });
        }
        // safety catch in case server error goes to catch, we can delete images...
        else {
          isImageStorageSuccessful = true;
          newExposedUrlFailure = newExposedImageUrl;
          // set new image to new thread based on update
          thread.threadImage = newExposedImageUrl;
        }
      } catch (error) {
        console.log("error in firebase delete image call: ", error);
      }
    }

    thread.title = title;
    thread.bio = bio;
    thread.links = links;
    thread.tags = tags;

    await thread.save();
    isDocUpdateSuccessful = true;

    res.status(200).json(thread.toObject());
  } catch (error) {
    console.log("Error in thread Create: ", error);
    const { threadImagePath } = req.body;
    // we only need to delete firebase cause imageStore document not created
    if (!isImageStorageSuccessful) {
      await deleteFirebaseImage(threadImagePath);
    }
    // we need to delete both image stores (firebase and mongodb imageStore document)
    else if (!isDocUpdateSuccessful) {
      await deleteImageStores(newExposedUrlFailure);
    }
    res.status(500).json({ message: "Error in create thread controller" });
  }
};

const getThreads = async (req, res) => {
  console.log("Get threads hit...");
  try {
    const threads = await Thread.find();
    res.status(200).json(threads);
  } catch (error) {
    console.log("Error in thread GET: ", error);
    res.status(500).json({ message: "Error in get threads controller" });
  }
};

const getThread = async (req, res) => {
  console.log("Get a single thread hit...");
  try {
    const thread = await Thread.findById(req.params.id).select(
      "-threadImagePath"
    );
    res.status(200).json(thread);
  } catch (error) {
    console.log("Error in single thread GET: ", error);
    res.status(500).json({ message: "Error in get single thread controller" });
  }
};

const getThreadByTitle = async (req, res) => {
  console.log("Get a single thread by title hit...");
  try {
    const threads = await Thread.find({
      title: { $regex: req.params.title, $options: "i" },
    });
    res.status(200).json(threads);
  } catch (error) {
    console.log("Error in single thread by title GET: ", error);
    res
      .status(500)
      .json({ message: "Error in get single thread by title controller" });
  }
};

const joinThread = async (req, res) => {
  console.log("Join thread route hit");
  try {
    // find a thread
    const thread = await Thread.findById(req.params.id);

    // mutate thread object, add req.user._id
    if (!thread.followers.includes(req.user._id)) {
      thread.followers.push(req.user._id);
    }
    // if aleady joined then you can remove them...
    else {
      // console.log("followers before slice: ", thread.followers);
      const index = thread.followers.indexOf(req.user._id);
      // console.log("index grabbed is: ", index);
      thread.followers.splice(index, 1);
      // console.log("slice performned...");
      // console.log("followers after slice: ", thread.followers);
    }

    await thread.save();

    res.status(200).json(thread);
  } catch (error) {
    console.log("Error in join thread: ", error);
    res.status(500).json({ message: "Error in join thread controller" });
  }
};

const deleteThread = async (req, res) => {
  console.log("Delete threads hit...");
  try {
    const thread = await Thread.findByIdAndDelete(req.params.id);
    res.status(200).json(thread);
  } catch (error) {
    console.log("Error in thread delete: ", error);
    res.status(500).json({ message: "Error in delete threads controller" });
  }
};

const getThreadsByUser = async (req, res) => {
  console.log("get threads for user.....");
  console.log("SIDE PANEL USER ----------------------------------");
  try {
    // console.log("USER THREAD OBJ: ", req.user._id);
    if (req.user) {
      const thread = await Thread.find({ followers: { $in: [req.user._id] } });
      return res.status(200).json(thread);
    } else {
      return res.status(500).json([]);
    }
  } catch (error) {
    console.log("Error in get thread by user: ", error);
    res.status(500).json({ message: "Error in delete threads controller" });
  }
};

export {
  createThread,
  getThreads,
  getThread,
  getThreadByTitle,
  joinThread,
  deleteThread,
  editThread,
  getThreadsByUser,
};
