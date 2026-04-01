import { UNITS } from '../data/products'

export default function ComprarView({ products, items, toggleDone, clearAll, onGoToPedir }) {
  const allItems = Object.entries(items)
  const doneCount = allItems.filter(([, v]) => v.done).length
  const total = allItems.length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0
  const allDone = total > 0 && doneCount === total

  // Sort: pending first, done at bottom
  const sorted = [...allItems].sort((a, b) => {
    if (a[1].done === b[1].done) return (a[1].addedAt || 0) - (b[1].addedAt || 0)
    return a[1].done ? 1 : -1
  })

  const handleClearAll = async () => {
    if (window.confirm('¿Limpiar la lista para empezar de nuevo?')) {
      await clearAll()
    }
  }

  if (total === 0) {
    return (
      <div className="empty-state">
        <div className="empty-emoji">🛒</div>
        <h2>La lista está vacía</h2>
        <p>Ve a "Pedir" para agregar productos</p>
        <button className="btn-primary" onClick={onGoToPedir}>
          Agregar productos
        </button>
      </div>
    )
  }

  return (
    <div className="comprar-view">
      {/* Progress */}
      <div className="progress-header">
        <span className="progress-text">{doneCount} de {total} comprados</span>
        <span className="progress-pct" style={{ color: '#4CAF50' }}>{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* All done celebration */}
      {allDone && (
        <div className="all-done">
          <div className="all-done-emoji">🎉</div>
          <h2>¡Todo comprado!</h2>
          <p>Lista lista para el próximo ciclo</p>
          <button className="btn-primary" onClick={handleClearAll}>
            Reiniciar lista
          </button>
        </div>
      )}

      {/* Shopping list */}
      {!allDone && (
        <div className="shopping-list">
          {sorted.map(([key, item]) => (
            <button
              key={key}
              className={`shop-item ${item.done ? 'done' : ''}`}
              onClick={() => toggleDone(key)}
            >
              <span className="shop-emoji">{item.emoji}</span>
              <div className="shop-info">
                <div className="shop-name">{item.name}</div>
                <div className="shop-qty">
                  {item.qty} {item.unit === 'cubeta' ? 'cubeta(s)' : item.unit}
                </div>
              </div>
              <div className={`check-circle ${item.done ? 'checked' : ''}`}>
                {item.done && '✓'}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Reset button at bottom */}
      {!allDone && doneCount > 0 && (
        <button className="btn-reset" onClick={handleClearAll}>
          Reiniciar lista completa
        </button>
      )}
    </div>
  )
}
