// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByzzHWL9DlrCzIOK88vKhtv7GmAr9EfHg",
  authDomain: "zensolve-info.firebaseapp.com",
  projectId: "zensolve-info",
  storageBucket: "zensolve-info.appspot.com",
  messagingSenderId: "94653433793",
  appId: "1:94653433793:web:e18e9695a092e66bfb5140",
  measurementId: "G-4Y2RYQEZHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);            // For authentication
const db = getFirestore(app);          // For Firestore database
const storage = getStorage(app);       // For Firebase storage

// Export the instances for use in other parts of the app
export { app, analytics, auth, db, storage };
