import { useState, useEffect } from 'react'
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'

const LIST_COL   = 'lista'
const CUSTOM_COL = 'custom_productos'

export function useCustomProducts() {
  const [customProducts, setCustomProducts] = useState({})

  useEffect(() => {
    const unsub = onSnapshot(collection(db, CUSTOM_COL),
      snap => {
        const data = {}
        snap.forEach(d => {
          const p = { ...d.data(), id: d.id }
          if (!data[p.category]) data[p.category] = []
          data[p.category].push(p)
        })
        setCustomProducts(data)
      },
      () => {}
    )
    return unsub
  }, [])

  const saveProduct = async (product) => {
    const id = product.id || `${product.category}_custom_${Date.now()}`
    await setDoc(doc(db, CUSTOM_COL, id), { ...product, id })
  }

  const deleteProduct = async (productId) => {
    await deleteDoc(doc(db, CUSTOM_COL, productId))
  }

  return { customProducts, saveProduct, deleteProduct }
}

export function useShoppingList() {
  const [items, setItems]     = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000)
    const unsub = onSnapshot(
      collection(db, LIST_COL),
      snap => {
        clearTimeout(timeout)
        const data = {}
        snap.forEach(d => { data[d.id] = d.data() })
        setItems(data)
        setLoading(false)
      },
      () => { clearTimeout(timeout); setLoading(false) }
    )
    return () => { clearTimeout(timeout); unsub() }
  }, [])

  const saveAllPending = async (pendingItems) => {
    const batch = writeBatch(db)
    for (const [key, item] of Object.entries(pendingItems)) {
      const existing = items[key]
      const prevQty  = existing?.confirmedQty || 0
      batch.set(doc(db, LIST_COL, key), {
        ...item,
        confirmedQty: prevQty + item.pendingQty,
        pendingQty:   0,
        done:         false,
        addedAt:      existing?.addedAt || Date.now(),
      })
    }
    await batch.commit()
  }

  const toggleDone = async (key) => {
    const current = items[key]
    if (!current) return
    await setDoc(doc(db, LIST_COL, key), { done: !current.done }, { merge: true })
  }

  const clearAll = async () => {
    const batch = writeBatch(db)
    Object.keys(items).forEach(key => batch.delete(doc(db, LIST_COL, key)))
    await batch.commit()
  }

  return { items, loading, saveAllPending, toggleDone, clearAll }
}
