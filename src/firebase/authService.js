import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from './config'

function assertFirebaseReady() {
  if (!auth || !db) {
    throw new Error('Firebase is not configured. Add your Firebase values to .env first.')
  }
}

export async function registerWithEmail(email, password) {
  assertFirebaseReady()
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const token = await credential.user.getIdToken()

  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email: credential.user.email,
    createdAt: serverTimestamp(),
  })

  return {
    token,
    user: {
      uid: credential.user.uid,
      email: credential.user.email,
    },
  }
}

export async function loginWithEmail(email, password) {
  assertFirebaseReady()
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const token = await credential.user.getIdToken()

  return {
    token,
    user: {
      uid: credential.user.uid,
      email: credential.user.email,
    },
  }
}

export function logoutUser() {
  assertFirebaseReady()
  return signOut(auth)
}
