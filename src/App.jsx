// ... (mismos imports)

export default function App() {
  // ... (mismos estados)
  const [showToast, setShowToast] = useState(false)

  const handleSave = async () => {
    if (cartCount === 0) return
    
    try {
      // 1. Guardar en Firebase (Batch)
      await saveAllPending(pending)
      
      // 2. Limpiar el estado de productos pendientes (esto pone los contadores a 0)
      setPending({}) 
      
      // 3. Feedback visual
      setSaved(true)
      setShowToast(true)
      
      // 4. Limpiar mensajes tras 3 segundos
      setTimeout(() => {
        setSaved(false)
        setShowToast(false)
      }, 3000)
      
    } catch (error) {
      alert("Error al guardar la lista")
    }
  }

  return (
    <div className="app">
      {/* Toast de guardado general */}
      {showToast && <div className="toast">🚀 ¡Lista enviada a "Comprar"!</div>}

      <div className="header">
        {/* ... mismo header ... */}
      </div>

      <div className="content">
        {loading || loadingProducts ? (
          <div className="loading">
            <div className="loading-spinner" />
            <p>Sincronizando datos...</p>
          </div>
        ) : mode === 'pedir' ? (
          <PedirView
            products={products}
            pending={pending} // Al estar vacío tras el save, todo vuelve a 0
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
          {saved ? '✓ ¡Guardado con éxito!' : `💾 Guardar Lista (${cartCount})`}
        </button>
      )}

      <FinancialTicker />
      
      {/* ... modales ... */}
    </div>
  )
}
