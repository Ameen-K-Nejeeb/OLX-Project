import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProductById, getProducts, saveProduct } from '../../firebase/productService'

export const fetchProducts = createAsyncThunk('products/fetchProducts', getProducts)

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (productId) => {
  return getProductById(productId)
})

export const upsertProduct = createAsyncThunk(
  'products/upsertProduct',
  async ({ values, currentUser, productId }) => {
    await saveProduct(values, currentUser, productId)
    return getProducts()
  },
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(upsertProduct.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(upsertProduct.fulfilled, (state, action) => {
        state.saving = false
        state.items = action.payload
      })
      .addCase(upsertProduct.rejected, (state, action) => {
        state.saving = false
        state.error = action.error.message
      })
  },
})

export const { clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
