// Import the functions you need from the SDKs you need
// import * as firebase from "firebase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-kQ0l-UWaaMpJSWWQSp0JEgDQa3QKqgo",
  authDomain: "money-money-system.firebaseapp.com",
  projectId: "money-money-system",
  storageBucket: "money-money-system.appspot.com",
  messagingSenderId: "815426542679",
  appId: "1:815426542679:web:76d272a53684b6128b9712",
  measurementId: "G-FMBCQ8D86M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
// firebase.initializeApp(firebaseConfig);

// export const auth = firebase.auth();
// export const googleAuthProvider = new firebase.auth.googleAuthProvider();
