import { createSlice } from '@reduxjs/toolkit'

function getStorageKey(userId) {
  return `olx_cart_${userId}`
}

function readSavedCart(userId) {
  if (!userId) return []

  try {
    return JSON.parse(localStorage.getItem(getStorageKey(userId)) || '[]')
  } catch {
    return []
  }
}

function persist(userId, items) {
  if (!userId) return
  localStorage.setItem(getStorageKey(userId), JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    userId: null,
    items: [],
  },
  reducers: {
    loadCartForUser(state, action) {
      state.userId = action.payload
      state.items = readSavedCart(action.payload)
    },
    clearCartSession(state) {
      state.userId = null
      state.items = []
    },
    addToCart(state, action) {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...product, quantity: 1 })
      }

      persist(state.userId, state.items)
    },
    updateQuantity(state, action) {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id)

      if (item) {
        item.quantity = Math.max(1, Number(action.payload.quantity))
      }

      persist(state.userId, state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
      persist(state.userId, state.items)
    },
    clearCart(state) {
      state.items = []
      persist(state.userId, state.items)
    },
    syncCartWithProducts(state, action) {
      const productsById = new Map(action.payload.map((product) => [product.id, product]))

      state.items = state.items
        .map((item) => {
          const latestProduct = productsById.get(item.id)
          return latestProduct ? { ...latestProduct, quantity: item.quantity } : null
        })
        .filter(Boolean)

      persist(state.userId, state.items)
    },
  },
})

export const {
  addToCart,
  clearCart,
  clearCartSession,
  loadCartForUser,
  removeFromCart,
  syncCartWithProducts,
  updateQuantity,
} = cartSlice.actions
export default cartSlice.reducer
