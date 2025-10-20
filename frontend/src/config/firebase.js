// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth , GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJEl0Dbmitb7q1GVyJ62sSWLMRd69k-sQ",
  authDomain: "fundameter.firebaseapp.com",
  projectId: "fundameter",
  storageBucket: "fundameter.firebasestorage.app",
  messagingSenderId: "892790591059",
  appId: "1:892790591059:web:1576157235d7276a24c0a6",
  measurementId: "G-YD5PJX5E77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//auth 
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export { auth , db , provider , app}