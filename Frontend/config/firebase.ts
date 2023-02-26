import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAKjSjWl2Z4wFbdKpe9YWFQmDjgMSfEgnY",
  authDomain: "devmatch-4d490.firebaseapp.com",
  databaseURL: "https://devmatch-4d490-default-rtdb.firebaseio.com",
  projectId: "devmatch-4d490",
  storageBucket: "devmatch-4d490.appspot.com",
  messagingSenderId: "698092561038",
  appId: "1:698092561038:web:639097ba82b5ddd4ce9fdf",
  measurementId: "G-JE7L9HLYP6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();