import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Initialize Firebase
let app: FirebaseApp | null = null
let db: Firestore | null = null

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
  }
  return app
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    const firebaseApp = getFirebaseApp()
    db = getFirestore(firebaseApp)
  }
  return db
}

// Collections
export const COLLECTIONS = {
  AGENCY: 'agency',
  SEO: 'seo',
  PROPERTY_TYPES: 'propertyTypes',
  LOCATIONS: 'locations',
  AGENTS: 'agents',
  PROPERTIES: 'properties',
  PROMOS: 'promos',
  ARTICLES: 'articles',
  REVIEWS: 'reviews',
  VISITORS: 'visitors',
  ADMIN_USERS: 'adminUsers',
} as const

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS]