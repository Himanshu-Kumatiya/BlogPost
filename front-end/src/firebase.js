// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//console.log(process.env.REACT_APP_FIREBASE_KEY)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "authenticate-92811.firebaseapp.com",
  projectId: "authenticate-92811",
  storageBucket: "authenticate-92811.appspot.com",
  messagingSenderId: "1009592074415",
  appId: "1:1009592074415:web:23afb3e021996c76a7145a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);