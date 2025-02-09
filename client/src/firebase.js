import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBc-dPaxvMQcFzg1EdIG31ej16caj2pHis",
  authDomain: "rektorluk-ba635.firebaseapp.com",
  projectId: "rektorluk-ba635",
  storageBucket: "rektorluk-ba635.firebasestorage.app",
  messagingSenderId: "271883478377",
  appId: "1:271883478377:web:f131d3d1a13bf062c449f8",
  measurementId: "G-LEJWLQH806"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app; 