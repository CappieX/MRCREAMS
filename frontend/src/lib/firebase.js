import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "mrcreams-dc47d.firebaseapp.com",
  projectId: "mrcreams-dc47d",
  storageBucket: "mrcreams-dc47d.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

// Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// 🔥 Connect emulators ONLY when running locally
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  console.log("🔥 Firebase emulators connected (Firestore + Auth)");
}
