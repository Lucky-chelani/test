// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOMQAssG1SUFsFb_dI-b1PBMvugOJfyBM",
  authDomain: "trovia-142e1.firebaseapp.com",
  projectId: "trovia-142e1",
  storageBucket: "trovia-142e1.firebasestorage.app",
  messagingSenderId: "548230347688",
  appId: "1:548230347688:web:a5b6949a82831d7af53b9d",
  measurementId: "G-MDT4526EYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };