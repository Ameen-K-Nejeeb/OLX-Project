import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearCart, removeFromCart, syncCartWithProducts, updateQuantity } from '../redux/slices/cartSlice'
import { fetchProducts } from '../redux/slices/productSlice'
import { formatCurrency } from '../utils/formatters'

function Cart() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const [syncError, setSyncError] = useState('')
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0)

  useEffect(() => {
    let isMounted = true

    dispatch(fetchProducts())
      .unwrap()
      .then((products) => {
        if (isMounted) dispatch(syncCartWithProducts(products))
      })
      .catch((error) => {
        if (isMounted) setSyncError(error.message || 'Unable to refresh cart items.')
      })

    return () => {
      isMounted = false
    }
  }, [dispatch])

  if (items.length === 0) {
    return (
      <section className="page empty-state">
        <h1>Your cart is empty</h1>
        <p className="muted">Add products from the marketplace to see totals here.</p>
        <Link className="primary-button" to="/">
          Browse listings
        </Link>
      </section>
    )
  }

  return (
    <section className="page cart-page">
      <div>
        <h1>Your cart</h1>
        <p className="muted">Update quantities or remove products before checkout.</p>
      </div>

      {syncError && <p className="alert">{syncError}</p>}

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.imageUrl || 'https://placehold.co/160x120?text=Item'} alt={item.title} />
              <div>
                <h2>{item.title}</h2>
                <p className="muted">{item.location}</p>
                <p className="price">{formatCurrency(item.price)}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                aria-label={`Quantity for ${item.title}`}
                onChange={(event) =>
                  dispatch(updateQuantity({ id: item.id, quantity: event.target.value }))
                }
              />
              <button className="ghost-button" type="button" onClick={() => dispatch(removeFromCart(item.id))}>
                Remove
              </button>
            </article>
          ))}
        </div>

        <aside className="summary-panel">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <button className="secondary-button full-width" type="button" onClick={() => dispatch(clearCart())}>
            Clear cart
          </button>
        </aside>
      </div>
    </section>
  )
}

export default Cart
