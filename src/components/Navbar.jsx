import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '../redux/slices/authSlice'
import { logoutUser } from '../firebase/authService'
import { clearCartSession } from '../redux/slices/cartSlice'
import { clearWishlistSession } from '../redux/slices/wishlistSlice'

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  )
  const wishlistCount = useSelector((state) => state.wishlist.items.length)

  async function handleLogout() {
    await logoutUser()
    dispatch(clearUser())
    dispatch(clearCartSession())
    dispatch(clearWishlistSession())
    navigate('/')
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Go to homepage">
        <span className="brand-mark">O</span>
        OLX Market
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/wishlist">Wishlist ({wishlistCount})</NavLink>
        <NavLink to="/cart">Cart ({cartCount})</NavLink>
        <NavLink className="sell-link" to="/sell">
          Sell
        </NavLink>
      </nav>

      <div className="auth-actions">
        {isAuthenticated ? (
          <>
            <span className="user-chip">{user?.email}</span>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-button" to="/login">
              Login
            </Link>
            <Link className="primary-button" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
