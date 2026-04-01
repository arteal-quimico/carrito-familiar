import { useState } from 'react'
import { useShoppingList, useProducts } from './hooks/useFirebase'
import { CATEGORIES } from './data/products'
import PedirView from './components/PedirView'
import ComprarView from './components/ComprarView'
import CreateProductModal from './components/CreateProductModal'
import FinancialTicker from './components/FinancialTicker'
import './App.css'

export default function App() {
  const [mode, setMode]             = useState('pedir')
  const [showCreate, setShowCreate] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [saved, setSaved]           = useState(false)
  const [pending, setPending]       = useState({})

  const { items, loading, saveAllPending, toggleDone, clearAll } = useShoppingList()
  const { products, loadingProducts, saveProduct, deleteProduct } = useProducts()

  const cartCount  = Object.keys(pending).length
  const doneCount  = Object.values(items).filter(i => i.done).length
  const totalItems = Object.values(items).filter(i => (i.confirmedQty || 0) > 0).length

  const handleSave = async () => {
    if (cartCount === 0) return
    await saveAllPending(pending)
    setPending({})
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleAddPending = (key, itemData) => {
    setPending(prev => ({ ...prev, [key]: itemData }))
  }

  const handleRemovePending = (key) => {
    setPending(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  return (
    <div className="app">
      <div className="header">
        <div className="header-top">
          <span className="header-title">🛒 Carrito Familiar</span>
          {mode === 'comprar' && totalItems > 0 && (
            <span className="header-badge">{doneCount}/{totalItems}</span>
          )}
        </div>
        <div className="mode-toggle">
          <button className={`mode-btn ${mode === 'pedir' ? 'active' : ''}`} onClick={() => setMode('pedir')}>
            📝 Pedir
          </button>
          <button className={`mode-btn ${mode === 'comprar' ? 'active' : ''}`} onClick={() => setMode('comprar')}>
            🛒 Comprando
          </button>
        </div>
      </div>

      <div className="content">
        {loading || loadingProducts ? (
          <div className="loading">
            <div className="loading-spinner" />
            <p>Cargando lista...</p>
          </div>
        ) : mode === 'pedir' ? (
          <PedirView
            products={products}
            pending={pending}
            onAddPending={handleAddPending}
            onRemovePending={handleRemovePending}
            onOpenCreate={() => setShowCreate(true)}
            onEditProduct={(p) => setEditProduct(p)}
          />
        ) : (
          <ComprarView
            items={items}
            toggleDone={toggleDone}
            clearAll={clearAll}
            onGoToPedir={() => setMode('pedir')}
          />
        )}
      </div>

      {mode === 'pedir' && cartCount > 0 && (
        <button className={`fab-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ ¡Lista guardada!' : `💾 Guardar Lista (${cartCount} productos)`}
        </button>
      )}

      <FinancialTicker />

      {showCreate && (
        <CreateProductModal
          onClose={() => setShowCreate(false)}
          onSave={saveProduct}
        />
      )}

      {editProduct && (
        <CreateProductModal
          editProduct={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={saveProduct}
          onDelete={deleteProduct}
        />
      )}
    </div>
  )
}
