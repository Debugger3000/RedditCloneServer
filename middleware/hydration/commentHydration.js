export function commentHydrate(users, comments) {
  // step 3 - append profileImage to each comment structure where id matches document...
  for (let i = 0; i < users.length; i++) {
    const userId = users[i]._id.toString();
    for (let j = 0; j < comments.length; j++) {
      // equal therefore hydrate this document with image
      if (userId === comments[j].owner.toString()) {
        console.log(
          "ids equal----- current comment image:",
          comments[j].ownerPicture
        );
        console.log("user profile image: ", users[i].profileImage);
        comments[j].ownerPicture = users[i].profileImage;
      }
    }
  }
  return comments;
}
