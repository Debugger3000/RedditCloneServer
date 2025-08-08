// src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Storage } from "@google-cloud/storage";
import { ImageStorage } from "../models/imageUrlStorage.js";

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

const app = initializeApp(getFirebaseStorage());

export const storage = getStorage(app);

export async function deleteFirebaseImage(path) {
  const refer = ref(storage, path);
  await deleteObject(refer);
  console.log("delete firebase image at path: ", path);
}

// firebase image upload PRE thread/user model
// we need to control firebase url READ access, so this creates our documents for that model
export async function imageStorageUpload(imageType, imagePath) {
  // create new image storage model...
  const imageStorage = new ImageStorage({
    imageType: imageType,
    imagePath: imagePath,
  });

  imageStorage.exposedUrl = `/api/userData/images/get/${imageStorage._id}`;

  await imageStorage.save();

  return `/api/userData/images/get/${imageStorage._id}`;
}

// delete image storage based on imagePath
// take exposed url from thread.threadImage, and find document based on that
export async function deleteImageStorage(imageExposedUrl) {
  console.log("exposed url given to delte image Storage: ", imageExposedUrl);
  const imageDocument = await ImageStorage.findOneAndDelete({
    exposedUrl: imageExposedUrl,
  });

  // if (imageDocument) {
  //   await imageDocument.deleteOne();
  // }

  // const all = await ImageStorage.find();
  // console.log("ALL image docs: ", all);

  console.log("imagedocument: ", imageDocument);
  // return old imagePath so we can delete from firebase next...
  return imageDocument.imagePath;
}

// get a bucket with headers set so we can send SIGNED URLS to client
export async function bucketStorage() {
  const storage = new Storage({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
    },
  });

  const bucket = storage.bucket(process.env.FIREBASE_storageBucket);

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

  // console.log(":cors bucker now: ", bucket);

  return bucket;
}
