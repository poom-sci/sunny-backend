import { cert } from "firebase-admin/app";
// import { getDatabase } from "firebase/database";
import admin from "firebase-admin";

const app = admin.initializeApp({
  credential: cert({
    // type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    // private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL

    // client_id: process.env.FIREBASE_CLIENT_ID,
    // auth_uri: process.env.FIREBASE_AUTH_URI,
    // token_uri: process.env.FIREBASE_TOKEN_URI,
    // auth_provider_x509_cert_url:
    // process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    // client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: process.env.FIREBASE_DATABASEURL
});

const auth = app.auth;
// const database = getDatabase(app);
// const database = app.database;

export { auth };

export default app;
