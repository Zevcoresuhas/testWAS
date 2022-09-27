// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB465acg99AMFxLqO4HRxPbJJ2r6TpZfXY",
  authDomain: "was-2022.firebaseapp.com",
  projectId: "was-2022",
  storageBucket: "was-2022.appspot.com",
  messagingSenderId: "82900230964",
  appId: "1:82900230964:web:bc287e75b713b816bcfb61",
  measurementId: "G-FMZSNLTLY4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
