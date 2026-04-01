import { useState, useRef } from 'react'
import { CATEGORIES, UNITS } from '../data/products'

const EMOJI_GALLERY = {
  'Lácteos y huevos': ['🥛','🧀','🧈','🥚','🍦','🫙','🧃','🍶'],
  'Frutas': ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍑','🥭','🍍','🥥','🍒','🍐','🍏'],
  'Verduras': ['🥦','🥕','🧅','🍅','🥬','🥔','🌽','🌶️','🫑','🥒','🧄','🫛','🍆','🥑','🫚'],
  'Proteínas': ['🥩','🍗','🐟','🥓','🫘','🐠','🍖','🦐','🦑','🦞','🥚','🍣','🍤'],
  'Carbohidratos': ['🥖','🍚','🍝','🥣','🌽','🥐','🍞','🥨','🧇','🥞','🫓','🍘','🍙'],
  'Bebidas': ['🧃','🥤','☕','🫖','🧋','🍵','🧉','🍺','🥛','🍷'],
  'Limpieza': ['🧴','🪥','🧻','🧼','🫧','🌸','🪣','🧹','🧺','🪒'],
  'Snacks': ['🍬','🍫','🍭','🍿','🥜','🫙','🍪','🎂','🍰','🧁'],
  'Otros': ['🛒','🫙','🥫','🍶','🧂','🌿','🪴','🐄','🐓','🐖'],
}

export default function CreateProductModal({ onClose, onSave, onDelete, editProduct }) {
  const isEdit = !!editProduct
  const [name, setName] = useState(editProduct?.name || '')
  const [emoji, setEmoji] = useState(editProduct?.emoji || '🛒')
  const [unit, setUnit] = useState(editProduct?.unit || 'u')
  const [category, setCategory] = useState(editProduct?.category || 'lacteos')
  const [aiHint, setAiHint] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('galeria')
  const [customEmoji, setCustomEmoji] = useState(editProduct?.emoji || '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const timerRef = useRef(null)

  const handleNameChange = (val) => {
    setName(val)
    clearTimeout(timerRef.current)
    if (val.length >= 3) {
      setAiLoading(true)
      setAiHint('')
      timerRef.current = setTimeout(() => suggestEmoji(val), 800)
    } else {
      setAiHint('')
      setAiLoading(false)
    }
  }

  const suggestEmoji = async (productName) => {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 10,
          messages: [{
            role: 'user',
            content: `Responde SOLO con un único emoji que represente mejor este producto de supermercado: "${productName}". Solo el emoji, nada más.`
          }]
        })
      })
      const data = await res.json()
      const suggested = data.content?.[0]?.text?.trim() || '🛍️'
      setEmoji(suggested)
      setCustomEmoji(suggested)
      setAiHint(`✨ IA sugiere: ${suggested}`)
    } catch {
      setAiHint('')
    } finally {
      setAiLoading(false)
    }
  }

  const handleCustomEmojiChange = (val) => {
    setCustomEmoji(val)
    const chars = [...val]
    if (chars.length > 0) setEmoji(chars[0])
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    await onSave({
      id: editProduct?.id || `custom_${Date.now()}`,
      name: name.trim(),
      emoji,
      unit,
      category,
    })
    setSaving(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await onDelete(editProduct)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Nombre */}
        <label className="field-label">Nombre del producto</label>
        <input
          className="field-input"
          placeholder="Ej: Aceite de oliva"
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          autoFocus
        />
        {aiLoading && <div className="ai-hint loading">✨ La IA está sugiriendo un ícono...</div>}
        {aiHint && !aiLoading && <div className="ai-hint">{aiHint}</div>}

        {/* Ícono */}
        <label className="field-label">Ícono seleccionado</label>
        <div className="emoji-selected">{emoji}</div>

        {/* Tabs */}
        <div className="emoji-tabs">
          <button
            className={`emoji-tab ${activeTab === 'galeria' ? 'active' : ''}`}
            onClick={() => setActiveTab('galeria')}
          >
            Galería
          </button>
          <button
            className={`emoji-tab ${activeTab === 'pegar' ? 'active' : ''}`}
            onClick={() => setActiveTab('pegar')}
          >
            Pegar emoji
          </button>
        </div>

        {activeTab === 'galeria' && (
          <div className="emoji-gallery">
            {Object.entries(EMOJI_GALLERY).map(([grupo, emojis]) => (
              <div key={grupo}>
                <div className="emoji-group-label">{grupo}</div>
                <div className="emoji-grid">
                  {emojis.map(em => (
                    <button
                      key={em}
                      className={`emoji-opt ${emoji === em ? 'selected' : ''}`}
                      onClick={() => { setEmoji(em); setCustomEmoji(em) }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pegar' && (
          <div style={{ marginTop: '8px' }}>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              Copia cualquier emoji desde internet o WhatsApp y pégalo aquí:
            </p>
            <input
              className="field-input"
              placeholder="Pega tu emoji aquí 👉"
              value={customEmoji}
              onChange={e => handleCustomEmojiChange(e.target.value)}
              style={{ fontSize: '24px', textAlign: 'center' }}
            />
          </div>
        )}

        {/* Categoría */}
        <label className="field-label">Categoría</label>
        <div className="options-row">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`option-pill ${category === cat.id ? 'selected' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Unidad */}
        <label className="field-label">Unidad de medida</label>
        <div className="options-row">
          {UNITS.map(u => (
            <button
              key={u.id}
              className={`option-pill ${unit === u.id ? 'selected' : ''}`}
              onClick={() => setUnit(u.id)}
            >
              {u.id === 'cubeta' ? '🥚 ' : ''}{u.label}
            </button>
          ))}
        </div>

        {/* Botones */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!name.trim() || saving}
          >
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>

        {/* Borrar */}
        {isEdit && (
          <button
            className={`btn-delete ${confirmDelete ? 'confirm' : ''}`}
            onClick={handleDelete}
          >
            {confirmDelete ? '⚠️ Toca de nuevo para confirmar borrado' : '🗑️ Borrar producto'}
          </button>
        )}
      </div>
    </div>
  )
}
