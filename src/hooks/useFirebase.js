import { useState, useEffect } from 'react'
import { 
  collection, doc, onSnapshot, 
  setDoc, deleteDoc, writeBatch, query, orderBy,
  increment, serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase'
import { DEFAULT_PRODUCTS, CATEGORIES } from '../data/products'

const LIST_COL      = 'lista'
const PRODUCTS_COL  = 'productos'

// Poblado inicial ultra-rápido
async function seedDatabase() {
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
    const q = query(collection(db, PRODUCTS_COL), orderBy('createdAt', 'asc'))
    
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        seedDatabase().finally(() => setLoadingProducts(false))
      } else {
        const data = {}
        snap.forEach(d => {
          const p = { ...d.data(), id: d.id }
          const cat = p.category
          if (!data[cat]) data[cat] = []
          data[cat].push(p)
        })
        setProducts(data)
        setLoadingProducts(false)
      }
    }, (error) => {
      console.error("Error en productos:", error)
      setLoadingProducts(false)
    })
    return unsub
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
    const unsub = onSnapshot(collection(db, LIST_COL), (snap) => {
      const data = {}
      snap.forEach(d => { data[d.id] = d.data() })
      setItems(data)
      setLoading(false)
    }, (error) => {
      console.error("Error en lista:", error)
      setLoading(false)
    })
    return unsub
  }, [])

  /**
   * REFACTOR: Gestión de items mejorada
   * 1. Usa increment() para evitar errores de suma si varios usuarios guardan.
   * 2. Limpia los datos locales antes de enviarlos a la nube.
   * 3. Registra la fecha exacta del servidor.
   */
  const saveAllPending = async (pendingItems) => {
    const batch = writeBatch(db)
    
    Object.entries(pendingItems).forEach(([key, item]) => {
      const docRef = doc(db, LIST_COL, key)
      
      // Extraemos solo lo necesario para la base de datos
      const { pendingQty, ...productData } = item

      batch.set(docRef, {
        ...productData,
        confirmedQty: increment(pendingQty), // Suma atómica en Firebase
        done: false,
        updatedAt: serverTimestamp(), // Fecha exacta del servidor
        addedAt: items[key]?.addedAt || Date.now() // Mantiene fecha original si existe
      }, { merge: true })
    })

    await batch.commit()
  }

  const toggleDone = async (key) => {
    const current = items[key]
    if (!current) return
    await setDoc(doc(db, LIST_COL, key), { 
      done: !current.done,
      updatedAt: serverTimestamp() 
    }, { merge: true })
  }

  const clearAll = async () => {
    const batch = writeBatch(db)
    Object.keys(items).forEach(key => batch.delete(doc(db, LIST_COL, key)))
    await batch.commit()
  }

  return { items, loading, saveAllPending, toggleDone, clearAll }
}
