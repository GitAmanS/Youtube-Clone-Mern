const admin = require('firebase-admin');

// console.log("project id:", process.env.FIREBASE_PROJECT_ID,
//   "privateKey:", process.env.FIREBASE_PRIVATE_KEY,
//   "clientEmail:", process.env.FIREBASE_CLIENT_EMAIL,
// )

admin.initializeApp({
  credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // e.g., my-project.appspot.com
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
