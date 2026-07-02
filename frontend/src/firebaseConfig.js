import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1a9QUX8xyeY2bQM8ZT6UWYBEp5Z-LNFU",
  authDomain: "test-mae-aef18.firebaseapp.com",
  projectId: "test-mae-aef18",
  storageBucket: "test-mae-aef18.firebasestorage.app",
  messagingSenderId: "561059065554",
  appId: "1:561059065554:web:e530adf34c9237f102870b",
  measurementId: "G-0DE9ZE0GXK",
  databaseURL: "https://test-mae-aef18-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
