import { useState, useEffect } from 'react'
import {
  collection, doc, onSnapshot,
  setDoc, deleteDoc, writeBatch, getDocs
} from 'firebase/firestore'
import { db } from '../firebase'
import { DEFAULT_PRODUCTS, CATEGORIES } from '../data/products'

const LIST_COL     = 'lista'
const PRODUCTS_COL = 'productos'

async function initProductsOnce() {
  if (localStorage.getItem('products_init')) return
  const snap = await getDocs(collection(db, PRODUCTS_COL))
  if (!snap.empty) {
    localStorage.setItem('products_init', '1')
    return
  }
  const batch = writeBatch(db)
  CATEGORIES.forEach(cat => {
    ;(DEFAULT_PRODUCTS[cat.id] || []).forEach(p => {
      const id = `${cat.id}_${p.id}`
      batch.set(doc(db, PRODUCTS_COL, id), {
        ...p, id, category: cat.id, custom: false
      })
    })
  })
  await batch.commit()
  localStorage.setItem('products_init', '1')
}

export function useProducts() {
  const [products, setProducts]       = useState({})
  const [loadingProducts, setLoading] = useState(true)

  useEffect(() => {
    // Timeout — si Firebase tarda más de 1.5s muestra igual
    const timeout = setTimeout(() => setLoading(false), 1500)

    initProductsOnce().then(() => {
      const unsub = onSnapshot(
        collection(db, PRODUCTS_COL),
        snap => {
          clearTimeout(timeout)
          const data = {}
          snap.forEach(d => {
            const p = { ...d.data(), id: d.id }
            if (!data[p.category]) data[p.category] = []
            data[p.category].push(p)
          })
          setProducts(data)
          setLoading(false)
        },
        () => {
          clearTimeout(timeout)
          setLoading(false)
        }
      )
      return unsub
    })

    return () => clearTimeout(timeout)
  }, [])

  const saveProduct = async (product) => {
    const id = product.id || `${product.category}_custom_${Date.now()}`
    await setDoc(doc(db, PRODUCTS_COL, id), { ...product, id })
  }

  const deleteProduct = async (productId) => {
    await deleteDoc(doc(db, PRODUCTS_COL, productId))
  }

  return { products, loadingProducts, saveProduct, deleteProduct }
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
      () => {
        clearTimeout(timeout)
        setLoading(false)
      }
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
