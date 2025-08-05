import { Thread } from "../models/threads.js";

const createThread = async (req, res) => {
  console.log("Create thread route hit");
  console.log("----------------------------");
  try {
    const { title, bio, links, tags, username, threadImage, threadImagePath } =
      req.body;
    const thread = new Thread({
      title: title,
      bio: bio,
      links: links,
      tags: tags,
      threadImage: threadImage,
      threadImagePath: threadImagePath,
      followers: [req.user._id],
      followersCount: 1,
      owner: username,
    });
    console.log("new thread object: ", thread);
    await thread.save();

    // grab new thead, without theadImagePath
    const returnThread = await Thread.findById(thread._id).select(
      "-threadImagePath"
    );

    res.status(200).json(returnThread);
  } catch (error) {
    console.log("Error in thread Create: ", error);
    res.status(500).json({ message: "Error in create thread controller" });
  }
};

const editThread = async (req, res) => {
  console.log("Edit thread route hit");
  try {
    const { title, bio, links, tags, threadImage, threadImagePath } = req.body;

    // grab old filePath if there is one...
    const thread = await Thread.findById(req.params.id);
    const filePath = thread.profileImagePath;

    // do we need to update image
    // if so, we need to grab old path, delete from firebase and update accordingly...
    if (filePath) {
      try {
        console.log("deleting from firebase storage...");
        // give filePath to firebase delete function...
        await deleteFirebaseImage(filePath);
      } catch (error) {
        console.log("error in firebase delete image call: ", error);
      }
    }

    thread.title = title;
    thread.bio = bio;
    thread.links = links;
    thread.tags = tags;
    thread.threadImage = threadImage;
    thread.threadImagePath = threadImagePath;

    await thread.save();
    const { profileImagePath, ...cleanThread } = thread.toObject();

    res.status(200).json(cleanThread);
  } catch (error) {
    console.log("Error in thread Create: ", error);
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
    console.log("USER THREAD OBJ: ", req.user._id);
    const thread = await Thread.find({ followers: { $in: [req.user._id] } });
    res.status(200).json(thread);
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
