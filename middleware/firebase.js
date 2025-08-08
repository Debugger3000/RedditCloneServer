// src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Storage } from "@google-cloud/storage";

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
        origin: ["http://localhost:4200"],
        method: ["PUT"],
        responseHeader: ["Content-Type"],
        maxAgeSeconds: 3600,
      },
    ],
  });

  // console.log(":cors bucker now: ", bucket);

  return bucket;
}
