import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5yFUCUPq0z4zdtj-NItxC9v7Ar2d6NVc",
  authDomain: "contractorcrm-a0e68.firebaseapp.com",
  projectId: "contractorcrm-a0e68",
  storageBucket: "contractorcrm-a0e68.appspot.com",
  messagingSenderId: "982516562362",
  appId: "1:982516562362:web:0b916454ce6ac9d5c20583"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };