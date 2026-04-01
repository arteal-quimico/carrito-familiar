import { useState, useEffect } from 'react'
import {
  collection, doc, onSnapshot,
  setDoc, deleteDoc, writeBatch
} from 'firebase/firestore'
import { db } from '../firebase'

const LIST_COL = 'lista'
const PRODUCTS_COL = 'productos_custom'

export function useShoppingList() {
  const [items, setItems] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, LIST_COL), snap => {
      const data = {}
      snap.forEach(d => { data[d.id] = d.data() })
      setItems(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const addItem = async (key, itemData) => {
    await setDoc(doc(db, LIST_COL, key), {
      ...itemData,
      pendingQty: itemData.qty || 0,
      confirmedQty: 0,
      done: false,
      addedAt: Date.now()
    })
  }

  const updateItem = async (key, updates) => {
    await setDoc(doc(db, LIST_COL, key), updates, { merge: true })
  }

  const removeItem = async (key) => {
    await deleteDoc(doc(db, LIST_COL, key))
  }

  const toggleDone = async (key) => {
    const current = items[key]
    if (!current) return
    await setDoc(doc(db, LIST_COL, key), { done: !current.done }, { merge: true })
  }

  const clearAll = async () => {
    const batch = writeBatch(db)
    Object.keys(items).forEach(key => {
      batch.delete(doc(db, LIST_COL, key))
    })
    await batch.commit()
  }

  return { items, loading, addItem, updateItem, removeItem, toggleDone, clearAll }
}

export function useCustomProducts() {
  const [customProducts, setCustomProducts] = useState({})

  useEffect(() => {
    const unsub = onSnapshot(collection(db, PRODUCTS_COL), snap => {
      const data = {}
      snap.forEach(d => {
        const p = d.data()
        if (!data[p.category]) data[p.category] = []
        data[p.category].push({ ...p, id: d.id, custom: true })
      })
      setCustomProducts(data)
    })
    return unsub
  }, [])

  const addCustomProduct = async (product) => {
    const id = `custom_${Date.now()}`
    await setDoc(doc(db, PRODUCTS_COL, id), { ...product, createdAt: Date.now() })
    return id
  }

  return { customProducts, addCustomProduct }
}
