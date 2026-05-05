import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearSelectedProduct, fetchProduct, upsertProduct } from '../redux/slices/productSlice'
import { getFriendlyFirebaseError } from '../utils/formatters'
import { validateProduct } from '../utils/validation'

const defaultValues = {
  title: '',
  description: '',
  price: '',
  location: '',
  category: 'Mobiles',
  imageUrl: '',
}

const categories = ['Mobiles', 'Vehicles', 'Property', 'Electronics', 'Furniture', 'Fashion']

function Sell() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const dispatch = useDispatch()
  const { selectedProduct, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    if (!isEditMode) return undefined

    dispatch(clearSelectedProduct())
    dispatch(fetchProduct(id))

    return () => dispatch(clearSelectedProduct())
  }, [dispatch, id, isEditMode])

  if (isEditMode && loading) return <p className="page-message">Loading product...</p>
  if (isEditMode && error) return <p className="page-message alert">{error}</p>
  if (isEditMode && selectedProduct?.id !== id) return <p className="page-message">Loading product...</p>

  const initialValues =
    isEditMode && selectedProduct
      ? {
          title: selectedProduct.title || '',
          description: selectedProduct.description || '',
          price: selectedProduct.price || '',
          location: selectedProduct.location || '',
          category: selectedProduct.category || 'Mobiles',
          imageUrl: selectedProduct.imageUrl || '',
        }
      : defaultValues

  return (
    <SellForm
      key={id || 'new-product'}
      id={id}
      isEditMode={isEditMode}
      initialValues={initialValues}
    />
  )
}

function SellForm({ id, isEditMode, initialValues }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.user)
  const { saving } = useSelector((state) => state.products)
  const [values, setValues] = useState(initialValues)
  const preview = values.imageUrl.trim()
  const [touchedFields, setTouchedFields] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  const errors = useMemo(() => validateProduct(values), [values])
  const visibleErrors = submitted
    ? errors
    : Object.fromEntries(Object.entries(errors).filter(([field]) => touchedFields[field]))

  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleBlur(event) {
    setTouchedFields((current) => ({ ...current, [event.target.name]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setServerError('')
    setSaveMessage('')

    if (Object.keys(errors).length > 0) return

    try {
      setSaveMessage('Saving product to Firestore...')
      await dispatch(
        upsertProduct({
          values,
          currentUser,
          productId: id,
        }),
      ).unwrap()
      navigate('/')
    } catch (error) {
      setServerError(getFriendlyFirebaseError(error))
    } finally {
      setSaveMessage('')
    }
  }

  return (
    <section className="page form-page">
      <form className="form-panel sell-form" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="eyebrow">{isEditMode ? 'Update listing' : 'Post an ad'}</p>
          <h1>{isEditMode ? 'Edit your product' : 'Sell something today'}</h1>
        </div>

        {serverError && <p className="alert">{serverError}</p>}

        <label>
          Title
          <input
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="iPhone 14 Pro"
          />
          {visibleErrors.title && <span className="field-error">{visibleErrors.title}</span>}
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="5"
            placeholder="Condition, age, accessories, reason for selling..."
          />
          {visibleErrors.description && <span className="field-error">{visibleErrors.description}</span>}
        </label>

        <div className="form-grid">
          <label>
            Price
            <input
              name="price"
              type="number"
              min="1"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {visibleErrors.price && <span className="field-error">{visibleErrors.price}</span>}
          </label>

          <label>
            Location
            <input
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Bengaluru"
            />
            {visibleErrors.location && <span className="field-error">{visibleErrors.location}</span>}
          </label>
        </div>

        <label>
          Category
          <select name="category" value={values.category} onChange={handleChange} onBlur={handleBlur}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          {visibleErrors.category && <span className="field-error">{visibleErrors.category}</span>}
        </label>

        <label>
          Product image URL
          <input
            name="imageUrl"
            type="url"
            value={values.imageUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://example.com/product-image.jpg"
          />
          {visibleErrors.imageUrl && <span className="field-error">{visibleErrors.imageUrl}</span>}
        </label>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Product preview" />
          </div>
        )}

        {saveMessage && <p className="muted form-status">{saveMessage}</p>}
        {serverError && <p className="alert form-submit-error">{serverError}</p>}

        <button className="primary-button full-width" type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEditMode ? 'Update product' : 'Publish product'}
        </button>
      </form>
    </section>
  )
}

export default Sell
