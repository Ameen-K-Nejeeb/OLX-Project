import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import { fetchProducts } from '../redux/slices/productSlice'
import { removeWishlistItem, syncWishlistWithProducts } from '../redux/slices/wishlistSlice'

function Wishlist() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.wishlist.items)
  const [syncError, setSyncError] = useState('')

  useEffect(() => {
    let isMounted = true

    dispatch(fetchProducts())
      .unwrap()
      .then((products) => {
        if (isMounted) dispatch(syncWishlistWithProducts(products))
      })
      .catch((error) => {
        if (isMounted) setSyncError(error.message || 'Unable to refresh saved listings.')
      })

    return () => {
      isMounted = false
    }
  }, [dispatch])

  return (
    <section className="page">
      <div className="market-header compact">
        <div>
          <p className="eyebrow">Saved ads</p>
          <h1>Wishlist</h1>
        </div>
      </div>

      {syncError && <p className="alert">{syncError}</p>}

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>No saved listings yet</h2>
          <p className="muted">Tap the heart on any listing to save it here.</p>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product) => (
            <div className="wishlist-wrap" key={product.id}>
              <ProductCard product={product} />
              <button
                className="ghost-button full-width"
                type="button"
                onClick={() => dispatch(removeWishlistItem(product.id))}
              >
                Remove from wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Wishlist
