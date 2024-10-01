
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCPu7z2bTaE6y0n49iLxUFd_S0wziIw0qs",
  authDomain: "login-9ffa4.firebaseapp.com",
  projectId: "login-9ffa4",
  storageBucket: "login-9ffa4.appspot.com",
  messagingSenderId: "827867987280",
  appId: "1:827867987280:web:35022b1340f9720f1f4055",
  measurementId: "G-JW9RE6P8YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const authenticate = getAuth(app)
const provider = new GoogleAuthProvider()
export{authenticate,provider}