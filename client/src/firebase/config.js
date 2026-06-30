import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH3gCURNxGCT4ua6PMp-6behxua9fKD3A",
  authDomain: "nida-ad6ec.firebaseapp.com",
  projectId: "nida-ad6ec",
  storageBucket: "nida-ad6ec.firebasestorage.app",
  messagingSenderId: "1020888662819",
  appId: "1:1020888662819:web:b55d935d22c9df6613c296",
  measurementId: "G-K5BTN8H8DD",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
