import { UserData } from "../models/userData.js";
import { Thread } from "../models/threads.js";

const getUserRecentThreads = async (req, res) => {
  console.log("get user recent threads route hit");
  try {
    // get userData schema object
    const userData = await UserData.find({ userId: req.user._id });

    // go through array, and grab each thread in order

    console.log("----------------------------------------------");

    res.status(200).json({ userData });
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
    const userData = await UserData.find({ userId: req.user._id });

    // add threadId to list of recent threads
    const copy = [...userData.recentArray];
    const length = copy.unshift(threadId);
    if (length > 5) {
      // remove 6th item
      copy.pop();
    }

    // send array, return sorted threads...
    const sortedThreads = await findRecentThreadsSort();

    console.log("----------------------------------------------");

    res.status(200).json({ userData });
  } catch (error) {
    console.log("Error in get users recent threads: ", error);
    res
      .status(500)
      .json({ message: "Error in get user recent threads controller" });
  }
};

async function findRecentThreadsSort(threadIdArray) {
  // go through array
  //  [1,2,3,4,5]
  // grab documents by id in array
  const recentThreads = await Thread.find({ _id: { $in: threadIdArray } });

  // sort them, pop each one in order of original array, with while until empty...
  const copy = [...recentThreads];
  const sorted = [];
  const idIndex = 0;
  const i = 0;
  const len = copy.length;
  while (len > 0) {
    if (threadIdArray[idIndex] == copy[i]) {
      // pop from copy, push to sorted
      const item = copy.splice(i, 1);
      sorted.push(item);
      i = 0;
      idIndex++;
      len = copy.length;
    }
    //   no match, so continue index..
    else {
      i++;
    }
  }

  return [1];
}

export { getUserRecentThreads, updateRecentThreads };
