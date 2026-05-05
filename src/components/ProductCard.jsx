import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import { toggleWishlist } from '../redux/slices/wishlistSlice'
import { formatCurrency } from '../utils/formatters'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id),
  )

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    dispatch(addToCart(product))
  }

  function handleToggleWishlist() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    dispatch(toggleWishlist(product))
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-link">
        <img
          src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
          alt={product.title}
        />
      </Link>
      <div className="product-card-body">
        <div className="product-heading">
          <Link to={`/products/${product.id}`}>
            <h3>{product.title}</h3>
          </Link>
          <button
            type="button"
            className={`icon-button ${isWishlisted ? 'active' : ''}`}
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? '\u2665' : '\u2661'}
          </button>
        </div>
        <p className="price">{formatCurrency(product.price)}</p>
        <p className="muted">{product.location}</p>
        <div className="product-actions">
          <Link className="secondary-button" to={`/products/${product.id}`}>
            View
          </Link>
          <button type="button" className="primary-button" onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
