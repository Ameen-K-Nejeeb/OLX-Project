import { createSlice } from '@reduxjs/toolkit'

function getStorageKey(userId) {
  return `olx_wishlist_${userId}`
}

function readSavedWishlist(userId) {
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

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    userId: null,
    items: [],
  },
  reducers: {
    loadWishlistForUser(state, action) {
      state.userId = action.payload
      state.items = readSavedWishlist(action.payload)
    },
    clearWishlistSession(state) {
      state.userId = null
      state.items = []
    },
    toggleWishlist(state, action) {
      const exists = state.items.some((item) => item.id === action.payload.id)
      state.items = exists
        ? state.items.filter((item) => item.id !== action.payload.id)
        : [...state.items, action.payload]
      persist(state.userId, state.items)
    },
    removeWishlistItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
      persist(state.userId, state.items)
    },
    syncWishlistWithProducts(state, action) {
      const productsById = new Map(action.payload.map((product) => [product.id, product]))
      state.items = state.items.map((item) => productsById.get(item.id)).filter(Boolean)
      persist(state.userId, state.items)
    },
  },
})

export const {
  clearWishlistSession,
  loadWishlistForUser,
  removeWishlistItem,
  syncWishlistWithProducts,
  toggleWishlist,
} = wishlistSlice.actions
export default wishlistSlice.reducer
