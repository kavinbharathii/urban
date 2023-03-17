import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-l8J-UOWQPd3TxCqHBCtuMvFWrpR-jfY",
  authDomain: "urban-6d98d.firebaseapp.com",
  projectId: "urban-6d98d",
  storageBucket: "urban-6d98d.appspot.com",
  messagingSenderId: "580479111215",
  appId: "1:580479111215:web:ecc34221a74888d79e76da",
  measurementId: "G-NR66JH0WGV"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app)