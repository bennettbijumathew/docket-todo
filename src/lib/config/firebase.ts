// Purpose: 
// This is a config file that exports instances of Firestore and Firebase Authentication. 
// This is then used through 

// Context:
// The exported objects are mainly used in controllers, repositories, and stores.  

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

// The firebase config uses a .env file to load information, this config is then
// used to initialize the app.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_BACKEND_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_BACKEND_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);

// Creates a database and authentication instance using the configured app.
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

// This is used for developer to connect an emulator to the instance. 
// if (import.meta.env.MODE === "development") {
//     connectFirestoreEmulator(db, '127.0.0.1', 8079);
//     connectAuthEmulator(auth, 'http://127.0.0.1:9098');
// }