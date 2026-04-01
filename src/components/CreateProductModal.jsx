import { useState } from 'react'
import { CATEGORIES, UNITS } from '../data/products'

const EMOJI_GALLERY = {
  'Lácteos':       ['🥛','🧀','🧈','🍦','🫙'],
  'Frutas':        ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍑','🥭'],
  'Verduras':      ['🥦','🥕','🧅','🍅','🥬','🥔','🌽','🌶️','🥒','🧄'],
  'Proteínas':     ['🥩','🍗','🐟','🥓','🫘','🐠','🍖','🦐','🍣','🥚'],
  'Carbohidratos': ['🥖','🍚','🍝','🥣','🥐','🍞','🥨','🧇','🥞','🫓'],
  'Bebidas':       ['🧃','🥤','☕','🫖','🧋','🍵','🥛','🍺'],
  'Limpieza':      ['🧴','🪥','🧻','🧼','🫧','🌸','🪣','🧹'],
  'Snacks':        ['🍬','🍫','🍭','🍿','🥜','🍪','🎂','🍰'],
  'Otros':         ['🛒','🫙','🥫','🧂','🌿','🪴'],
}

export default function CreateProductModal({ onClose, onSave, onDelete, editProduct }) {
  const isEdit = !!editProduct
  const [name,          setName]          = useState(editProduct?.name     || '')
  const [emoji,         setEmoji]         = useState(editProduct?.emoji    || '🛒')
  const [unit,          setUnit]          = useState(editProduct?.unit     || 'u')
  const [category,      setCategory]      = useState(editProduct?.category || 'lacteos')
  const [activeTab,     setActiveTab]     = useState('galeria')
  const [customEmoji,   setCustomEmoji]   = useState(editProduct?.emoji    || '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saving,        setSaving]        = useState(false)

  const handleSave = async () => {
    if (!name.trim() || saving) return
    setSaving(true)
    const id = editProduct?.id || `${category}_custom_${Date.now()}`
    await onSave({ id, name: name.trim(), emoji, unit, category, custom: true })
  }

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await onDelete(editProduct.id)
  }

  const handleCustomEmojiChange = (val) => {
    setCustomEmoji(val)
    const chars = [...val]
    if (chars.length > 0) setEmoji(chars[0])
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <label className="field-label">Nombre</label>
        <input className="field-input" placeholder="Ej: Aceite de oliva" value={name} onChange={e => setName(e.target.value)} autoFocus />

        <label className="field-label">Ícono — {emoji}</label>
        <div className="emoji-tabs">
          <button className={`emoji-tab ${activeTab === 'galeria' ? 'active' : ''}`} onClick={() => setActiveTab('galeria')}>Galería</button>
          <button className={`emoji-tab ${activeTab === 'pegar' ? 'active' : ''}`} onClick={() => setActiveTab('pegar')}>Pegar emoji</button>
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
          <input className="field-input" placeholder="Pega un emoji aquí 👉" value={customEmoji} onChange={e => handleCustomEmojiChange(e.target.value)} style={{ fontSize: '24px', textAlign: 'center', marginTop: '10px' }} />
        )}

        <label className="field-label">Categoría</label>
        <div className="options-row">
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`option-pill ${category === cat.id ? 'selected' : ''}`} onClick={() => setCategory(cat.id)}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <label className="field-label">Unidad</label>
        <div className="options-row">
          {UNITS.map(u => (
            <button key={u.id} className={`option-pill ${unit === u.id ? 'selected' : ''}`} onClick={() => setUnit(u.id)}>
              {u.id === 'cubeta' ? '🥚 ' : ''}{u.label}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave} disabled={!name.trim() || saving}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>

        {isEdit && (
          <button className={`btn-delete ${confirmDelete ? 'confirm' : ''}`} onClick={handleDelete}>
            {confirmDelete ? '⚠️ Toca de nuevo para confirmar' : '🗑️ Eliminar producto'}
          </button>
        )}
      </div>
    </div>
  )
}
