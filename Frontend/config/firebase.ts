import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAIwjpd-vtye1XED7Y8tRf9i-90HSoNh0o",
  authDomain: "devmatch-8f074.firebaseapp.com",
  projectId: "devmatch-8f074",
  storageBucket: "devmatch-8f074.appspot.com",
  messagingSenderId: "435146119189",
  appId: "1:435146119189:web:0f2ba0db98ff664059d61c",
  measurementId: "G-RZHC3ZPNRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
