import { initializeApp } from "firebase/app";
import  { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDiVYed8vg0YE8KECI6LDGBHxlxGwXFHDc",
  authDomain: "talkverse-983b1.firebaseapp.com",
  projectId: "talkverse-983b1",
  storageBucket: "talkverse-983b1.appspot.com",
  messagingSenderId: "771866760203",
  appId: "1:771866760203:web:60d079091f577716f4a30e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);