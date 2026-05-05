import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

function hasValue(value) {
  return Boolean(value) && !String(value).startsWith('your-')
}

const firebaseConfig = {
  apiKey: "AIzaSyDnLACDGChLJEBi5J0E3sCPTyFCmd-DdaQ",
  authDomain: "olx-project-ac5f7.firebaseapp.com",
  projectId: "olx-project-ac5f7",
  messagingSenderId: "467920363788",
  appId: "1:467920363788:web:f7414eaa71d47231a3a929",
  measurementId: "G-LK4WFMSR4H"
};

// Initialize Firebase
export const isFirebaseConfigured = Object.values(firebaseConfig).every(hasValue)

// The initialized Firebase services are shared by authService and productService.
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export default app


