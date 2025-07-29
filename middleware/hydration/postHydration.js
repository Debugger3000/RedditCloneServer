import { User } from "../../models/users.js";

// general hydration - which takes list of user ids, and returns mongo User Documents in a list
export async function generalUserHydration(collection) {
  // step 1
  // Go through data grab list of each unique user id
  let userIds = [];
  const seen = new Set();
  for (let i = 0; i < collection.length; i++) {
    const ownerId = collection[i].owner;
    if (!seen.has(ownerId)) {
      seen.add(ownerId);
      userIds.push(ownerId);
    }
  }
  console.log("user ids....", userIds);

  // step 2 grab user list from list of ids
  const users = await User.find({ _id: { $in: userIds } }).select(
    "_id profileImage username"
  );
  console.log("users grabbed....", users);
  return users;
}

// hydrate posts for in thread view... User profile image
export function hydratePostsWithUserImage(users, posts) {
  for (let i = 0; i < users.length; i++) {
    const userId = users[i]._id.toString();
    for (let j = 0; j < posts.length; j++) {
      // equal therefore hydarte this document with image
      if (userId === posts[j].owner.toString()) {
        console.log(
          "ids equal----- current comment imge:",
          posts[j].ownerPicture
        );
        console.log("user profile image: ", users[i]);
        posts[j].ownerPicture = users[i].profileImage;
        posts[j].ownerUsername = users[i].username;
      }
    }
  }
  return posts;
}

// hydrate posts for general view... Thread image
