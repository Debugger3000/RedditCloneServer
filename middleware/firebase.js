// src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Storage } from "@google-cloud/storage";

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

// {
//   "type": "service_account",
//   "project_id": "reddit-clone-blob",
//   "private_key_id": "0ebc31ee975d2d7f4292ba3cf9a488a9b82d4300",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKFxWTju9XiPLa\n+2vHjPEizMambpTmbHdNXFAsfSuiRqiwEanLduBHOAp7BXszUt8XZ4GfnY6bzuqH\nq8a/8yz4+rgrJWMoL1H2U8+J7jqvBh14P7OmWc//KyNz3PkOnhq+JvInK7O7N3n3\nQ2r0/dvfOMoFouJPA6d5O22J06PVC+yF2GRsUoW2iwi0QVFzc5UDyeGW6bJgSbK8\nF0b229BZBscO5/8CZ7LnvkeoqBnJmllI2opYcnnGCNGsbGXffwNfUQiA7In9/+I5\nDld8DsKGD4G1HLvPqKnRAAsUpfrqzQusivLzg/vGdNwhoWs0WVx9uubO14ydaY+0\nQi/N9SQPAgMBAAECggEAVgUtcfnNdv0cIooSfoZHvgBcLkuzpcFVpuA8YDOHdzOM\naiWamLipDqeUDnluz5He1B+C1WZDZZ7VxZogp2PjKLfP3M21P02lHazfEl8NK6L2\nuFClL5HbL0o1dQQCH269A2Ogf3virTYX/F/+DvpftMx/cZa7rdZoWvoozhoACpae\n8i9WMA9xG+Qk3vGcE0f3Kk7uJP41ATBbauUjgx7lkEONi0nWliPG8S8349xdGeyV\nHFynL/zQcP6el8q3Wdomeuip8zM4TBq/mhhQrnfVj7af1JKtnhsyvpk/LVAZ5hTg\ndtEm//i8sUDrJLfcKr2U7+3PPvs1y8l23+Q4o/R8QQKBgQDtB1QoNhrq+AjuBKbB\nryd/l117HJCVPrVrqZUMUpX2Cn0Kr+/KXGYIHTyrRRko76avXl8mGUZ9hyaEA2GY\nn9QPaq8EK81ly2hJe+BreRtwgcHEQeK82gxQluZUVT8gVuhpoollEYfvLaKG8nUc\nsEmGRz5sLPP/Nc31BIPEJL83CwKBgQDaQ9+Pi0EQeNyxKNOms3KthQj90yQW5Xnh\nEXnNB6fIZq52tdNoQoG7CzPH0pjX1RdHdQA9vAPStmnCQj+Ya8bZCgExOjRAwzFe\nQXmWflt1xjqn+8Gl02RAUpWo4qXaAc6x77VecizT5uJe0snr9+VCOt2wVB6I3LZg\nYdJPsCNZjQKBgQCUccaO+HObPIO7LUaSfnOqQM3W0GjsTz2nk6k48m/gi2kMTGtM\nvNlZs5XPXZMIRC6MHfpRDftLmlzQyJ1SzKYukY3SeuxEGEPT4bUHGe3JZDpKA0lR\nJO4Zeqf9oPXL9yHPJnAN0BDmBhqHkUkvEmi5o9zAOtcEulmmXZF4QdtPSQKBgCnA\n3C6AjCTTihxV3A9CushY77xmvLuokGUuy6ceNMmQYwWQiO2j819NqE0si1KWkAp6\nZl5o7i5L+PVRaQsGaxav5ER/hulwrawDSHgymdpw3l2uOoA3bTEk2z5ghSusNtcx\nLPfxTYQH4fwTxM7gMDo4Opp1rRWvazAK5omZ/1ktAoGAXDEiBWOCOnDm01Y24bUi\nDYEtB3UDYdnsedZgU4amW+/c9kWvZHj+5jF5Xbqmyo1NpDkDFOVXu3T9ALuO34Er\nUSHZOQxB8SjypV9P37AbXsX1/snUu9qP+xiSSdLqbxeIKTJ/OAjEUmifP2aJt+AY\nU7sJV1DuDJmXfgIEIyggc9E=\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-fbsvc@reddit-clone-blob.iam.gserviceaccount.com",
//   "client_id": "113772596714584828398",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40reddit-clone-blob.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }
