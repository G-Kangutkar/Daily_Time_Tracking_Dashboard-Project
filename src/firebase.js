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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
