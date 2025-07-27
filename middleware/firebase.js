// src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject } from "firebase/storage";

function getFirebaseStorage() {
  const storage = {
    apiKey: process.env.FIREBASE_apiKey,
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
