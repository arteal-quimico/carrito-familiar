import { useState, useEffect } from 'react'
import { 
  collection, doc, onSnapshot, 
  setDoc, deleteDoc, writeBatch, getDocs 
} from 'firebase/firestore'
import { db } from '../firebase'
import { DEFAULT_PRODUCTS, CATEGORIES } from '../data/products'

const LIST_COL      = 'lista'
const PRODUCTS_COL  = 'productos'

// Inicializa productos por defecto si la base está vacía 
async function initProducts() {
  const snap = await getDocs(collection(db, PRODUCTS_COL))
  if (!snap.empty) return
  
  const batch = writeBatch(db)
  CATEGORIES.forEach(cat => {
    const prods = DEFAULT_PRODUCTS[cat.id] || []
    prods.forEach(p => {
      const id = `${cat.id}_${p.id}`
      batch.set(doc(db, PRODUCTS_COL, id), {
        ...p, category: cat.id, custom: false, createdAt: Date.now()
      })
    })
  })
  await batch.commit()
}

export function useProducts() {
  const [products, setProducts] = useState({})
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    initProducts().then(() => {
      const unsub = onSnapshot(collection(db, PRODUCTS_COL), snap => {
        const data = {}
        snap.forEach(d => {
          const p = { ...d.data(), id: d.id }
          const cat = p.category
          if (!data[cat]) data[cat] = []
          data[cat].push(p)
        })
        setProducts(data)
        setLoadingProducts(false)
      })
      return unsub
    })
  }, [])

  const saveProduct = async (product) => {
    const id = product.id || `${product.category}_custom_${Date.now()}`
    await setDoc(doc(db, PRODUCTS_COL, id), {
      ...product, id, createdAt: Date.now()
    })
    return id
  }

  const deleteProduct = async (productId) => {
    await deleteDoc(doc(db, PRODUCTS_COL, productId))
  }

  return { products, loadingProducts, saveProduct, deleteProduct }
}

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

  // Guarda todos los productos seleccionados en un solo proceso (Batch) 
  const saveAllPending = async (pendingItems) => {
    const batch = writeBatch(db)
    
    for (const [key, item] of Object.entries(pendingItems)) {
      const existing = items[key]
      
      // Si el producto ya estaba en la lista, sumamos las cantidades 
      if (existing && (existing.confirmedQty || 0) > 0) {
        batch.set(doc(db, LIST_COL, key), {
          ...existing,
          confirmedQty: (existing.confirmedQty || 0) + item.pendingQty,
          pendingQty: 0,
          done: false,
        }, { merge: true })
      } else {
        // Si es nuevo, lo creamos desde cero 
        batch.set(doc(db, LIST_COL, key), {
          ...item,
          confirmedQty: item.pendingQty,
          pendingQty: 0,
          done: false,
          addedAt: Date.now(),
        })
      }
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
