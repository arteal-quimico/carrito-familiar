import { useState } from 'react'
import { CATEGORIES, UNITS } from '../data/products'

export default function PedirView({ 
  products, 
  pending, 
  onAddPending, 
  onRemovePending, 
  onOpenCreate, 
  onEditProduct 
}) {
  const [selectedCat, setSelectedCat] = useState('lacteos')

  // Genera la llave única para identificar el producto en el estado 'pending'
  const getKey = (catId, productId) => `${catId}_${productId}`

  // Obtiene la cantidad actual del estado 'pending' (si se resetea en App.jsx, esto vuelve a 0)
  const getQty = (catId, productId) => {
    const key = getKey(catId, productId)
    return pending[key]?.pendingQty || 0
  }

  const changeQty = (catId, product, delta) => {
    const key = getKey(catId, product.id)
    const currentQty = getQty(catId, product.id)
    const newQty = Math.max(0, currentQty + delta)

    if (newQty === 0) {
      onRemovePending(key)
    } else {
      onAddPending(key, {
        productId: product.id,
        catId,
        name: product.name,
        emoji: product.emoji,
        unit: product.unit,
        pendingQty: newQty,
        confirmedQty: 0,
      })
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
          const qty = getQty(selectedCat, product.id)
          const isAdded = qty > 0
          const unitLabel = UNITS.find(u => u.id === product.unit)?.label || product.unit

          return (
            <div key={product.id} className={`product-card ${isAdded ? 'added' : ''}`}>
              {/* Botón de edición pequeño en la esquina */}
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditProduct({ ...product, category: selectedCat })
                }}
              >
                ✏️
              </button>
              
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

        {/* Botón especial para crear un producto nuevo en la categoría actual */}
        <button className="product-card create-card" onClick={onOpenCreate}>
          <span className="product-emoji">➕</span>
          <div className="product-name">Crear nuevo</div>
          <div className="product-unit">En esta sección</div>
        </button>
      </div>
    </div>
  )
}
