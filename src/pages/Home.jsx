import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import { fetchProducts } from '../redux/slices/productSlice'

const categories = ['All', 'Mobiles', 'Vehicles', 'Property', 'Electronics', 'Furniture', 'Fashion']

function Home() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.products)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const filteredProducts = useMemo(() => {
    return items.filter((product) => {
      const text = `${product.title} ${product.location} ${product.category}`.toLowerCase()
      const matchesSearch = text.includes(searchTerm.toLowerCase())
      const matchesCategory = category === 'All' || product.category === category

      return matchesSearch && matchesCategory
    })
  }, [category, items, searchTerm])

  return (
    <section className="page">
      <div className="market-header">
        <div>
          <p className="eyebrow">Fresh listings</p>
          <h1>Buy and sell nearby</h1>
          <p className="muted">Find used phones, furniture, vehicles, electronics, and more.</p>
        </div>
        <div className="search-panel">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search title, category, or location"
            aria-label="Search products"
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="alert">{error}</p>}
      {loading && <p className="page-message">Loading products...</p>}

      {!loading && filteredProducts.length === 0 && (
        <div className="empty-state">
          <h2>No listings found</h2>
          <p className="muted">Try another search or create the first listing from the Sell page.</p>
        </div>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default Home
