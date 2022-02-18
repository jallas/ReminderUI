// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi7ENZOHbW5QHY-4PKBjqJR29h63vIdE0",
  authDomain: "reminder-2bd6c.firebaseapp.com",
  projectId: "reminder-2bd6c",
  storageBucket: "reminder-2bd6c.appspot.com",
  messagingSenderId: "1035097535744",
  appId: "1:1035097535744:web:796a4ed58496534dba2fe5",
  measurementId: "G-6RNXL9RXJG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);