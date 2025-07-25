import { UserData } from "../models/userData.js";
import { Thread } from "../models/threads.js";

const getUserRecentThreads = async (req, res) => {
  console.log("get user recent threads route hit");
  try {
    // get userData schema object
    const userData = await UserData.findOne({ userId: req.user._id });

    // console.log("userData document in get Recent: ", userData);

    // go through array, and grab each thread in order
    // send array, return sorted threads...
    if (!userData || userData.length == 0) {
      const newUserData = new UserData({
        userId: req.user._id,
      });

      await newUserData.save();

      // console.log("creating new userData Document...");

      // const newSortedThreads = await findRecentThreadsSort(
      // newUserData.recentThreads.threadIdList
      // );

      res.status(200).json({ threadList: [] });
    } else {
      // console.log("userData in get Recent: ", userData.recentThreads);
      const sortedThreads = await findRecentThreadsSort(
        userData.recentThreads.threadIdList
      );
      res.status(200).json(sortedThreads);
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
    // console.log("thread id for update: ", threadId);
    // get userData schema object
    const userData = await UserData.findOne({ userId: req.user._id });

    // console.log("update original array: ", userData);
    // add threadId to list of recent threads
    let copy = [...userData.recentThreads.threadIdList];
    // console.log("copy: ", copy);
    // check if it already exists in the array, if so, then find it, splice, and unshift to start
    // let find = copy.findIndex(threadId);
    // let index = -1;
    // for(let i = 0; i < copy.length; i++){
    //   if(threadId == )
    // }
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

  // console.log("copy of thread object array", copy);
  // for (let i = 0; i < copy.length; i++) {
  //   console.log("thread id: ", copy[i]._id);
  // }
  // edge cases:
  // cannot have duplicates
  //
  // console.log("copy before sort: ", copy);
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

  // console.log("copy after sorted: ", sorted.length);

  return sorted;
}

export { getUserRecentThreads, updateRecentThreads };
