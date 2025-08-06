import {
  generalUserHydration,
  hydratePostsWithUserImage,
} from "../middleware/hydration/postHydration.js";
import { Post } from "../models/posts.js";
import { User } from "../models/users.js";
import { getCacheData, setCacheData } from "../middleware/redis.js";

const createPost = async (req, res) => {
  console.log("Create Post route hit");
  try {
    const {
      title,
      textContent,
      parentThread,
      parentThreadTitle,
      tag,
      parentThreadImage,
    } = req.body;

    const post = new Post({
      title: title,
      textContent: textContent,
      parentThread: parentThread,
      parentThreadTitle: parentThreadTitle,
      tag: tag,
      commentCount: 0,
      parentThreadImage: parentThreadImage,
      owner: req.user._id,
    });
    await post.save();
    res.status(200).json({ post });
  } catch (error) {
    console.log("Error in post Create: ", error);
    res.status(500).json({ message: "Error in create post controller" });
  }
};

const getPostsForThread = async (req, res) => {
  console.log("Get posts for a thread route hit");
  try {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);

    const feedType = req.query.feedType;
    // -1 by default so always grabbing latest...
    let sortVal = -1;
    if (feedType === "oldest") {
      sortVal = 1;
    }

    const skip = (page - 1) * 5;

    const posts = await Post.find({ parentThread: req.params.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortVal })
      .lean();

    // hydrate posts
    const postUsers = await generalUserHydration(posts);
    const hydratedPosts = hydratePostsWithUserImage(postUsers, posts);

    // console.log("hydrated posts: ", hydratedPosts);
    res.status(200).json(hydratedPosts);
  } catch (error) {
    console.log("Error in post Create: ", error);
    res.status(500).json({ message: "Error in create post controller" });
  }
};

// get posts for home...
const getPosts = async (req, res) => {
  console.log("Get ALL posts for HOME route hit");
  try {
    // const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const feedType = req.query.feedType;
    console.log("feedStype: ", feedType);

    // cache key based on pagination page and feedType
    const redisKey = `home:${page}:${feedType}`;

    // check cache for data first before any DB calls
    // const cached = await getCacheData(redisKey);
    console.log("returned cached data before IF: ");
    // console.log("length of cached: ", cached.length);

    // cached && cached.length == limit
    if (false) {
      console.log("We grabbed cached data !");
      res.status(200).json(cached);
    } else {
      // -1 by default so always grabbing latest...
      let sortVal = -1;
      if (feedType === "oldest") {
        sortVal = 1;
      }
      console.log("feedStype: ", sortVal);
      // console.log("limit is now: ", limit);
      // console.log("page before is now: ", page);
      const skip = (page - 1) * 5;
      // console.log("page after is now: ", page);

      const posts = await Post.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: sortVal });

      // set cache data for posts return
      const cachedData = await setCacheData(redisKey, posts);
      console.log("We grabbed from DB, and set Cached data");

      // console.log("posts length: ", posts.length);

      res.status(200).json(posts);
    }
  } catch (error) {
    console.log("Error in post GET ALL POSTS: ", error);
    res.status(500).json({ message: "Error in create post controller" });
  }
};

// get post data by ID
const getPost = async (req, res) => {
  console.log("Get post route hit");
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in GET POST: ", error);
    res.status(500).json({ message: "Error in get post controller" });
  }
};

const deletePost = async (req, res) => {
  console.log("delete post route hit.....................................");
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in delete POST: ", error);
    res.status(500).json({ message: "Error in delete post controller" });
  }
};

// votes

const vote = async (req, res) => {
  console.log("vote post route hit.....................................");
  console.log("VOTE VOTE VOTE VOTE");
  try {
    const { postId, voteType } = req.body;

    // find post
    const post = await Post.findById(postId);

    // update posts up or down votes, by incrementing/decrementing based on voteType
    if (voteType) {
      // true type of vote so increment votes on post
      post.voteCount++;
    } else {
      // subtract but make sure postCount is not 0
      if (post.voteCount != 0) {
        post.voteCount--;
      }
    }
    await post.save();

    // grab user, and we add object to its vote array
    const user = await User.findById(req.user._id);
    if (user) {
      // check to see if user already has object for this post
      const vote = user.votes.find((item) => item.postId == postId);
      if (vote) {
        vote.voteType = voteType;
      } else {
        user.votes.push({ postId: postId, voteType: voteType });
      }
    }
    await user.save();
    console.log("users votes array: ", user.votes);

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in VOTE POST: ", error);
    res.status(500).json({ message: "Error in Vote post controller" });
  }
};

export { createPost, getPosts, getPostsForThread, getPost, deletePost, vote };
