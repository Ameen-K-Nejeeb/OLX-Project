import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { auth, isFirebaseConfigured } from './firebase/config'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import Register from './pages/Register'
import Sell from './pages/Sell'
import Wishlist from './pages/Wishlist'
import { clearCartSession, loadCartForUser } from './redux/slices/cartSlice'
import { clearUser, setAuthLoading, setCredentials } from './redux/slices/authSlice'
import { clearWishlistSession, loadWishlistForUser } from './redux/slices/wishlistSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isFirebaseConfigured) {
      dispatch(clearUser())
      dispatch(clearCartSession())
      dispatch(clearWishlistSession())
      return undefined
    }

    dispatch(setAuthLoading(true))

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(clearUser())
        dispatch(clearCartSession())
        dispatch(clearWishlistSession())
        return
      }

      const token = await firebaseUser.getIdToken()

      dispatch(
        setCredentials({
          token,
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          },
        }),
      )
      dispatch(loadCartForUser(firebaseUser.uid))
      dispatch(loadWishlistForUser(firebaseUser.uid))
    })

    return unsubscribe
  }, [dispatch])

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        {!isFirebaseConfigured ? (
          <FirebaseSetupNotice />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <Sell />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sell/:id"
              element={
                <ProtectedRoute>
                  <Sell />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
    </div>
  )
}

function FirebaseSetupNotice() {
  return (
    <section className="page setup-page">
      <div className="form-panel setup-panel">
        <p className="eyebrow">Firebase setup required</p>
        <h1>Connect your Firebase project</h1>
        <p className="muted">
          The app is running, but Firebase still has placeholder values. Create a `.env` file from
          `.env.example`, add your Firebase web app config, then restart the dev server.
        </p>
        <pre className="code-panel">{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}</pre>
      </div>
    </section>
  )
}

export default App
