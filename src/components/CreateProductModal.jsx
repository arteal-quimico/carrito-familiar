import { useState } from 'react'
import { CATEGORIES, UNITS } from '../data/products'

const EMOJI_GALLERY = {
  'Lácteos': ['🥛','🧀','🧈','🥚','🍦','🫙','🧃','🍶'],
  'Frutas': ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍑','🥭','🍍','🥥','🍒','🍐','🍏'],
  'Verduras': ['🥦','🥕','🧅','🍅','🥬','🥔','🌽','🌶️','🫑','🥒','🧄','🫛','🍆','🥑','🫚'],
  'Proteínas': ['🥩','🍗','🐟','🥓','🫘','🐠','🍖','🦐','🦑','🦞','🥚','🍣','🍤'],
  'Carbohidratos': ['🥖','🍚','🍝','🥣','🌽','🥐','🍞','🥨',' waffle','🥞','🫓'],
  'Bebidas': ['🧃','🥤','☕','🫖','🧋','🍵','🥛'],
  'Limpieza': ['🧴','🪥','🧻','🧼','🫧','🌸','🪣','🧹','🧺','🪒'],
  'Snacks': ['🍬','🍫','🍭','🍿','🥜','🍪','🎂','🍰','🧁'],
  'Otros': ['🛒','🫙','🥫','🧂','🌿','🪴'],
}

export default function CreateProductModal({ onClose, onSave, onDelete, editProduct }) {
  const isEdit = !!editProduct
  const [name, setName]               = useState(editProduct?.name || '')
  const [emoji, setEmoji]             = useState(editProduct?.emoji || '🛒')
  const [unit, setUnit]               = useState(editProduct?.unit || 'u')
  const [category, setCategory]       = useState(editProduct?.category || 'lacteos')
  const [activeTab, setActiveTab]     = useState('galeria')
  const [customEmoji, setCustomEmoji] = useState(editProduct?.emoji || '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [toast, setToast]             = useState('')

  const handleSave = async () => {
    if (!name.trim()) return
    const id = editProduct?.id || `${category}_custom_${Date.now()}`
    
    await onSave({ id, name: name.trim(), emoji, unit, category, custom: true })
    
    setToast(isEdit ? '✅ ¡Cambios guardados!' : '✅ ¡Producto creado!')
    setTimeout(() => onClose(), 1000) // Cierre automático tras 1 seg
  }

  const handleDelete = async () => {
    if (!confirmDelete) { 
      setConfirmDelete(true)
      return 
    }
    await onDelete(editProduct.id)
    setToast('🗑️ Producto eliminado')
    setTimeout(() => onClose(), 1000) // Cierre automático tras 1 seg
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {toast && <div className="toast">{toast}</div>}

        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <label className="field-label">Nombre del producto</label>
        <input
          className="field-input"
          placeholder="Ej: Aceite de oliva"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />

        <label className="field-label">Ícono: {emoji}</label>
        <div className="emoji-tabs">
          <button className={`emoji-tab ${activeTab === 'galeria' ? 'active' : ''}`} onClick={() => setActiveTab('galeria')}>Galería</button>
          <button className={`emoji-tab ${activeTab === 'pegar' ? 'active' : ''}`} onClick={() => setActiveTab('pegar')}>Pegar Emoji</button>
        </div>

        {activeTab === 'galeria' ? (
          <div className="emoji-gallery">
            {Object.entries(EMOJI_GALLERY).map(([grupo, emojis]) => (
              <div key={grupo}>
                <div className="emoji-group-label">{grupo}</div>
                <div className="emoji-grid">
                  {emojis.map(em => (
                    <button key={em} className={`emoji-opt ${emoji === em ? 'selected' : ''}`} onClick={() => setEmoji(em)}>{em}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <input
            className="field-input"
            placeholder="Pega un emoji aquí"
            value={customEmoji}
            onChange={e => {
              setCustomEmoji(e.target.value)
              if ([...e.target.value].length > 0) setEmoji([...e.target.value][0])
            }}
            style={{ fontSize: '24px', textAlign: 'center', marginTop: '10px' }}
          />
        )}

        <label className="field-label">Categoría</label>
        <div className="options-row">
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`option-pill ${category === cat.id ? 'selected' : ''}`} onClick={() => setCategory(cat.id)}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave} disabled={!name.trim()}>
            {isEdit ? 'Actualizar' : 'Crear Producto'}
          </button>
        </div>

        {isEdit && (
          <button className={`btn-delete ${confirmDelete ? 'confirm' : ''}`} onClick={handleDelete}>
            {confirmDelete ? '⚠️ Confirmar eliminación' : '🗑️ Eliminar de la base'}
          </button>
        )}
      </div>
    </div>
  )
}
