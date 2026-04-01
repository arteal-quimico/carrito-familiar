// ─────────────────────────────────────────────
//  PASO 1 — Pega aquí tus credenciales de Firebase
//  Ve a: https://console.firebase.google.com
//  Crea un proyecto → Agrega una app web → Copia la config
// ─────────────────────────────────────────────
import { initializeApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "TU_API_KEY",
  authDomain:        "TU_PROYECTO.firebaseapp.com",
  projectId:         "TU_PROYECTO",
  storageBucket:     "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId:             "TU_APP_ID"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Permite usar la app sin internet (sincroniza al volver)
enableIndexedDbPersistence(db).catch(() => {})
