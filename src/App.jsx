import { useState } from 'react'
import { useShoppingList, useCustomProducts } from './hooks/useFirebase'
import { CATEGORIES, DEFAULT_PRODUCTS } from './data/products'
import PedirView from './components/PedirView'
import ComprarView from './components/ComprarView'
import CreateProductModal from './components/CreateProductModal'
import FinancialTicker from './components/FinancialTicker'
import './App.css'

export default function App() {
  const [mode, setMode] = useState('pedir')
  const [showCreate, setShowCreate] = useState(false)
  const { items, loading, addItem, updateItem, toggleDone, clearAll } = useShoppingList()
  const { customProducts, addCustomProduct } = useCustomProducts()

  const allProducts = {}
  CATEGORIES.forEach(cat => {
    allProducts[cat.id] = [
      ...(DEFAULT_PRODUCTS[cat.id] || []),
      ...(customProducts[cat.id] || []),
    ]
  })

  const cartCount = Object.keys(items).length
  const doneCount = Object.values(items).filter(i => i.done).length

  return (
    <div className="app">

      <div className="header">
        <div className="header-top">
          <span className="header-title">🛒 Carrito Familiar</span>
          {mode === 'comprar' && cartCount > 0 && (
            <span className="header-badge">{doneCount}/{cartCount}</span>
          )}
        </div>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'pedir' ? 'active' : ''}`}
            onClick={() => setMode('pedir')}
          >
            📝 Pedir
          </button>
          <button
            className={`mode-btn ${mode === 'comprar' ? 'active' : ''}`}
            onClick={() => setMode('comprar')}
          >
            🛒 Comprando
          </button>
        </div>
      </div>

      <div className="content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
            <p>Cargando lista...</p>
          </div>
        ) : mode === 'pedir' ? (
          <PedirView
            products={allProducts}
            items={items}
            addItem={addItem}
            updateItem={updateItem}
            onOpenCreate={() => setShowCreate(true)}
          />
        ) : (
          <ComprarView
            products={allProducts}
            items={items}
            toggleDone={toggleDone}
            clearAll={clearAll}
            onGoToPedir={() => setMode('pedir')}
          />
        )}
      </div>

      {mode === 'pedir' && cartCount > 0 && (
        <button className="fab" onClick={() => setMode('comprar')}>
          🛒 {cartCount} producto{cartCount > 1 ? 's' : ''} — Ir a comprar
        </button>
      )}

      <FinancialTicker />

      {showCreate && (
        <CreateProductModal
          onClose={() => setShowCreate(false)}
          onSave={addCustomProduct}
        />
      )}
    </div>
  )
}
