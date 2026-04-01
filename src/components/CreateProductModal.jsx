import { useState, useRef } from 'react'
import { CATEGORIES, UNITS } from '../data/products'

const EMOJI_OPTIONS = [
  '🥫','🫙','🍶','🧃','🥤','🍬','🍫','🌶️','🫚','🧂',
  '🫛','🥜','🌿','🍋','🥝','🍑','🥭','🫐','🥥','🌰',
  '🫒','🥗','🍲','🥘','🫕','🍱','🥡','🧆','🧇','🧈',
]

export default function CreateProductModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🥫')
  const [unit, setUnit] = useState('u')
  const [category, setCategory] = useState('lacteos')
  const [aiHint, setAiHint] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
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
      setAiHint(`✨ IA sugiere: ${suggested}`)
    } catch {
      setAiHint('')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    await onSave({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      emoji,
      unit,
      category,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Nuevo producto</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Name */}
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

        {/* Emoji */}
        <label className="field-label">Ícono</label>
        <div className="emoji-selected">{emoji}</div>
        <div className="emoji-grid">
          {EMOJI_OPTIONS.map(em => (
            <button
              key={em}
              className={`emoji-opt ${emoji === em ? 'selected' : ''}`}
              onClick={() => setEmoji(em)}
            >
              {em}
            </button>
          ))}
        </div>

        {/* Category */}
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

        {/* Unit */}
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

        {/* Buttons */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!name.trim() || saving}
          >
            {saving ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      </div>
    </div>
  )
}
