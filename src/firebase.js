import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://ai-project-36184-default-rtdb.asia-southeast1.firebasedatabase.app/',
  apiKey: 'AIzaSyDummy_Replace_With_Real_Key',
  authDomain: 'ai-project-36184.firebaseapp.com',
  projectId: 'ai-project-36184',
  storageBucket: 'ai-project-36184.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
