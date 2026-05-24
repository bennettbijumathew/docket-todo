// Purpose: 
// This is a config file that exports instances of Firestore and Firebase Authentication. 
// This is then used through 

// Context:
// The exported objects are mainly used in controllers, repositories, and stores.  

import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

// The firebase config uses a .env file to load information, this config is then
// used to initialize the app.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_TAURI_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_TAURI_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);

// Creates a database and authentication instance using the configured app.
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

// This is used for developer to connect an emulator to the instance. 
// Connects Firebase's database and auth instance to an emulator for storage and authentication.
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    connectFirestoreEmulator(db, import.meta.env.VITE_FIREBASE_EMULATOR_HOST, import.meta.env.VITE_FIRESTORE_EMULATOR_PORT);
    connectAuthEmulator(auth, `http://${import.meta.env.VITE_FIREBASE_EMULATOR_HOST}:${import.meta.env.VITE_AUTH_EMULATOR_PORT}`);
}