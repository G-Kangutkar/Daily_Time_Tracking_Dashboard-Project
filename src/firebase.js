import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAVEEtsi39DBChHj_Cu2V04gzulVeZDOcs",
  authDomain: "ai-project-36184.firebaseapp.com",
  databaseURL: "https://ai-project-36184-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-project-36184",
  storageBucket: "ai-project-36184.firebasestorage.app",
  messagingSenderId: "1040023061480",
  appId: "1:1040023061480:web:25d0c9e23171cde3999a5d",
  measurementId: "G-LQYGZ1DTCD"
};
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
