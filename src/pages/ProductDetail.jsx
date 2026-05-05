import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import { fetchProduct, sellProduct } from '../redux/slices/productSlice'
import { toggleWishlist } from '../redux/slices/wishlistSlice'
import { formatCurrency, getFriendlyFirebaseError } from '../utils/formatters'

function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { selectedProduct: product, loading, error, saving } = useSelector((state) => state.products)
  const currentUser = useSelector((state) => state.auth.user)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    dispatch(fetchProduct(id))
  }, [dispatch, id])

  if (loading) return <p className="page-message">Loading listing...</p>
  if (error) return <p className="page-message alert">{error}</p>
  if (!product) return <p className="page-message">Listing not found.</p>

  const isSeller = currentUser?.uid === product.sellerId

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    if (product.isSold) return
    dispatch(addToCart(product))
  }

  function handleToggleWishlist() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    if (product.isSold) return
    dispatch(toggleWishlist(product))
  }

  async function handleMarkSold() {
    setActionError('')

    try {
      await dispatch(sellProduct({ productId: product.id, currentUser })).unwrap()
      navigate('/')
    } catch (soldError) {
      setActionError(getFriendlyFirebaseError(soldError))
    }
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

        {product.isSold && <p className="alert">This product is sold and no longer available.</p>}
        {actionError && <p className="alert">{actionError}</p>}

        <div className="seller-box">
          <strong>Seller</strong>
          <span>{product.sellerEmail || 'Private seller'}</span>
        </div>

        <div className="detail-actions">
          <button className="primary-button" type="button" onClick={handleAddToCart} disabled={product.isSold}>
            Add to cart
          </button>
          <button className="secondary-button" type="button" onClick={handleToggleWishlist} disabled={product.isSold}>
            Save listing
          </button>
          {isSeller && (
            <>
              <Link className="ghost-button" to={`/sell/${product.id}`}>
                Edit listing
              </Link>
              <button className="ghost-button" type="button" onClick={handleMarkSold} disabled={saving}>
                {saving ? 'Marking sold...' : 'Mark as sold'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
