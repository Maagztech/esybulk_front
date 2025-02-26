import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1QOjM-xCf4kIK0PG70RYvQKljnenbbgQ",
  authDomain: "esybulk-f437c.firebaseapp.com",
  projectId: "esybulk-f437c",
  storageBucket: "esybulk-f437c.firebasestorage.app",
  messagingSenderId: "204818550386",
  appId: "1:204818550386:web:75d2047b0c47c066ba3ceb",
  measurementId: "G-Q2J105WL8B",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
