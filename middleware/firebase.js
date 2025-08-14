// src/firebase-config.ts
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, deleteObject } from "firebase/storage";
import { Storage } from "@google-cloud/storage";
import { ImageStorage } from "../models/imageUrlStorage.js";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

// console.log("private key: ", process.env.FIREBASE_PRIVATE_KEY);

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_projectId,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  storageBucket: process.env.FIREBASE_storageBucket,
});

// get a bucket with headers set so we can send SIGNED URLS to client
export async function getBucket() {
  console.log("CREATING SIGNED URLS...");

  const bucket = getStorage().bucket();
  await bucket.setCorsConfiguration([
    {
      origin: [process.env.ORIGIN],
      method: ["PUT", "GET", "POST", "HEAD"],
      responseHeader: ["Content-Type", "x-goog-resumable"],
      maxAgeSeconds: 3600,
    },
  ]);
  console.log("returning bucket hehe");
  const [corsConfig] = await bucket.getMetadata();
  console.log(corsConfig);

  // console.log("bucket signed url: ", bucket);
  return bucket;
}

function getFirebaseStorage() {
  const storage = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_authDomain,
    projectId: process.env.FIREBASE_projectId,
    storageBucket: process.env.FIREBASE_storageBucket,
    messagingSenderId: process.env.FIREBASE_messagingSenderId,
    appId: process.env.FIREBASE_appId,
    measurementId: process.env.FIREBASE_measurementId,
  };
  // console.log("storage item used for firebase delete: ", storage);
  return storage;
}

// admin firebase
// const app = initializeApp();

// const app = initializeApp(getFirebaseStorage());

// export const storage = getStorage(app);

export async function deleteFirebaseImage(path) {
  const bucket = getStorage().bucket();
  await bucket.file(path).delete();
  // const refer = ref(storage, path);
  // await deleteObject(refer);
  console.log("delete firebase image at path: ", path);
}

// firebase image upload PRE thread/user model
// we need to control firebase url READ access, so this creates our documents for that model
export async function imageStorageUpload(imageType, imagePath) {
  // create new image storage model...
  try {
    console.log("IMAGE STORAGE UPLOADING...");

    const imageStorage = new ImageStorage({
      imageType: imageType,
      imagePath: imagePath,
    });

    imageStorage.exposedUrl = `/api/userData/images/get/${imageStorage._id}`;

    await imageStorage.save();

    return `/api/userData/images/get/${imageStorage._id}`;
  } catch (error) {
    return null;
  }
}

// delete image storage based on imagePath
// take exposed url from thread.threadImage, and find document based on that
export async function deleteImageStorage(imageExposedUrl) {
  console.log("exposed url given to DELETE IMAGE STORAGE... ", imageExposedUrl);
  const imageDocument = await ImageStorage.findOneAndDelete({
    exposedUrl: imageExposedUrl,
  });

  // console.log("ALL image docs: ", all);
  if (imageDocument) {
    return imageDocument.imagePath;
  } else {
    return null;
  }

  console.log("imagedocument: ", imageDocument);
  // return old imagePath so we can delete from firebase next...
}

// general delete function for images
// deletes both firebase and mongoDB image storage documents
export async function deleteImageStores(exposedUrl) {
  try {
    const oldImageFirebasePath = await deleteImageStorage(exposedUrl);
    console.log("Deleted image storage document", oldImageFirebasePath);

    // give filePath to firebase delete function...
    await deleteFirebaseImage(oldImageFirebasePath);
    console.log("Deleted from firebase storage");
  } catch (error) {
    console.log("error in deleteImage Stores, firebase middleware", error);
  }
}

// --------------------
// get a bucket with headers set so we can send SIGNED URLS to client
export async function bucketStorage() {
  console.log("CREATING SIGNED URLS...");

  const newPrivateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const storage = new Storage({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: newPrivateKey,
    },
  });

  console.log("after storage created...");
  const bucket = storage.bucket(process.env.FIREBASE_storageBucket);
  console.log("after bucket created...");
  // set meta data for firebase bucket here...
  await bucket.setMetadata({
    cors: [
      {
        origin: [process.env.ORIGIN],
        method: ["PUT"],
        responseHeader: ["Content-Type"],
        maxAgeSeconds: 3600,
      },
    ],
  });
  console.log("after after metadata set for bucket... pre return");

  // console.log(":cors bucker now: ", bucket);

  return bucket;
}
