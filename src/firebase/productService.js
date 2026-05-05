import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './config'

const firebaseTimeoutMs = 45000

function assertFirebaseReady() {
  if (!db) {
    throw new Error('Firebase is not configured. Add your Firebase values to .env first.')
  }
}

function withTimeout(promise, actionName) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => {
        reject(new Error(`${actionName} is taking too long. Check Firebase setup, rules, and network.`))
      }, firebaseTimeoutMs)
    }),
  ])
}

export async function getProducts() {
  assertFirebaseReady()
  const productsRef = collection(db, 'products')
  const snapshot = await withTimeout(
    getDocs(query(productsRef, orderBy('createdAt', 'desc'))),
    'Loading products',
  )

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

export async function getProductById(productId) {
  assertFirebaseReady()
  const snapshot = await withTimeout(getDoc(doc(db, 'products', productId)), 'Loading product')

  if (!snapshot.exists()) {
    throw new Error('Product not found.')
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export async function saveProduct(productData, currentUser, productId) {
  assertFirebaseReady()

  const payload = {
    title: productData.title.trim(),
    description: productData.description.trim(),
    price: Number(productData.price),
    location: productData.location.trim(),
    category: productData.category,
    imageUrl: productData.imageUrl.trim(),
    sellerId: currentUser.uid,
    sellerEmail: currentUser.email,
    updatedAt: serverTimestamp(),
  }

  if (productId) {
    await withTimeout(updateDoc(doc(db, 'products', productId), payload), 'Product update')
    return productId
  }

  const productsRef = collection(db, 'products')
  const created = await withTimeout(
    addDoc(productsRef, {
      ...payload,
      createdAt: serverTimestamp(),
    }),
    'Product creation',
  )

  return created.id
}
