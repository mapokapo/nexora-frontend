import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN4TNuYEAoHTz8frXwuxEtrGfnZ5DxWRg",
  authDomain: "nexora-5e930.firebaseapp.com",
  projectId: "nexora-5e930",
  storageBucket: "nexora-5e930.firebasestorage.app",
  messagingSenderId: "145486786797",
  appId: "1:145486786797:web:9c960876e5f6c8d1cf1ce4",
  measurementId: "G-9ESEB2T9PB",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
