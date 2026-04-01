import { useState } from 'react'
import { CATEGORIES, UNITS } from '../data/products'

export default function PedirView({ products, items, addItem, updateItem, onOpenCreate }) {
  const [selectedCat, setSelectedCat] = useState('lacteos')
  const [localQty, setLocalQty] = useState({})

  const getItemKey = (catId, productId) => `${catId}_${productId}`

  const getQty = (catId, productId) => {
    const key = getItemKey(catId, productId)
    return localQty[key] || 0
  }

  const changeQty = async (catId, product, delta) => {
    const key = getItemKey(catId, product.id)
    const currentQty = getQty(catId, product.id)
    const newQty = Math.max(0, currentQty + delta)

    setLocalQty(prev => ({ ...prev, [key]: newQty }))

    if (newQty === 0) {
      if (items[key] && (items[key].confirmedQty || 0) === 0) {
        const { removeItem } = await import('../hooks/useFirebase')
      }
    } else if (!items[key]) {
      await addItem(key, {
        productId: product.id,
        catId,
        name: product.name,
        emoji: product.emoji,
        unit: product.unit,
        qty: newQty,
        pendingQty: newQty,
        confirmedQty: 0,
      })
    } else {
      await updateItem(key, { pendingQty: newQty })
    }
  }

  const currentCat = CATEGORIES.find(c => c.id === selectedCat)
  const prods = products[selectedCat] || []

  return (
    <div className="pedir-view">
      <div className="section-label">Categorías</div>
      <div className="categories-scroll">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`cat-pill ${cat.id === selectedCat ? 'selected' : ''}`}
            onClick={() => setSelectedCat(cat.id)}
          >
            <span className="cat-pill-icon">{cat.icon}</span>
            <span className="cat-pill-name">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="section-label">{currentCat?.name}</div>
      <div className="products-grid">
        {prods.map(product => {
          const key = getItemKey(selectedCat, product.id)
          const qty = getQty(selectedCat, product.id)
          const isAdded = qty > 0
          const unitLabel = UNITS.find(u => u.id === product.unit)?.label || product.unit

          return (
            <div
              key={product.id}
              className={`product-card ${isAdded ? 'added' : ''}`}
            >
              <span className="product-emoji">{product.emoji}</span>
              <div className="product-name">{product.name}</div>
              <div className="product-unit">{unitLabel}</div>
              <div className="qty-controls">
                <button
                  className="qty-btn minus"
                  onClick={() => changeQty(selectedCat, product, -1)}
                  disabled={qty === 0}
                >
                  −
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  className="qty-btn plus"
                  onClick={() => changeQty(selectedCat, product, 1)}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}

        <button className="product-card create-card" onClick={onOpenCreate}>
          <span className="product-emoji">➕</span>
          <div className="product-name">Crear producto</div>
        </button>
      </div>
    </div>
  )
}
