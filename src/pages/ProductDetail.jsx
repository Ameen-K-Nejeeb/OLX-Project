import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import { fetchProduct } from '../redux/slices/productSlice'
import { toggleWishlist } from '../redux/slices/wishlistSlice'
import { formatCurrency } from '../utils/formatters'

function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { selectedProduct: product, loading, error } = useSelector((state) => state.products)
  const currentUser = useSelector((state) => state.auth.user)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    dispatch(fetchProduct(id))
  }, [dispatch, id])

  if (loading) return <p className="page-message">Loading listing...</p>
  if (error) return <p className="page-message alert">{error}</p>
  if (!product) return <p className="page-message">Listing not found.</p>

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
    <section className="page detail-page">
      <div className="detail-media">
        <img src={product.imageUrl || 'https://placehold.co/900x650?text=No+Image'} alt={product.title} />
      </div>
      <div className="detail-info">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.title}</h1>
        <p className="detail-price">{formatCurrency(product.price)}</p>
        <p className="muted">{product.location}</p>
        <p>{product.description}</p>

        <div className="seller-box">
          <strong>Seller</strong>
          <span>{product.sellerEmail || 'Private seller'}</span>
        </div>

        <div className="detail-actions">
          <button className="primary-button" type="button" onClick={handleAddToCart}>
            Add to cart
          </button>
          <button className="secondary-button" type="button" onClick={handleToggleWishlist}>
            Save listing
          </button>
          {currentUser?.uid === product.sellerId && (
            <Link className="ghost-button" to={`/sell/${product.id}`}>
              Edit listing
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
