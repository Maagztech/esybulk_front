import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1QOjM-xCf4kIK0PG70RYvQKljnenbbgQ",
  authDomain: "esybulk-f437c.firebaseapp.com",
  projectId: "esybulk-f437c",
  storageBucket: "esybulk-f437c.firebasestorage.app",
  messagingSenderId: "204818550386",
  appId: "1:204818550386:web:75d2047b0c47c066ba3ceb",
  measurementId: "G-Q2J105WL8B",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
