import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { getFirebaseDb, CollectionName } from './firebase'

/**
 * Get a single document by ID
 */
export async function getDocument<T = DocumentData>(
  collectionName: CollectionName,
  id: string
): Promise<T | null> {
  try {
    const db = getFirebaseDb()
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data() as T
      // Convert Firestore timestamps to ISO strings
      return convertTimestampsToISO(data)
    }
    return null
  } catch (error) {
    console.error(`Error getting document ${id} from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Get all documents from a collection
 */
export async function getCollection<T = DocumentData>(
  collectionName: CollectionName
): Promise<T[]> {
  try {
    const db = getFirebaseDb()
    const collectionRef = collection(db, collectionName)
    const querySnapshot = await getDocs(collectionRef)

    const documents: T[] = []
    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data({ serverTimestamps: 'estimate' }) } as T
      documents.push(convertTimestampsToISO(data) as T)
    })

    return documents
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw error
  }
}

/**
 * Query a collection with constraints
 */
export async function queryCollection<T = DocumentData>(
  collectionName: CollectionName,
  constraints: QueryConstraint[]
): Promise<T[]> {
  try {
    const db = getFirebaseDb()
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, ...constraints)
    const querySnapshot = await getDocs(q)

    const documents: T[] = []
    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data({ serverTimestamps: 'estimate' }) } as T
      documents.push(convertTimestampsToISO(data) as T)
    })

    return documents
  } catch (error) {
    console.error(`Error querying collection ${collectionName}:`, error)
    throw error
  }
}

/**
 * Create a new document
 */
export async function createDocument<T = DocumentData>(
  collectionName: CollectionName,
  data: WithFieldValue<T>,
  id?: string
): Promise<string> {
  try {
    const db = getFirebaseDb()
    const collectionRef = collection(db, collectionName)

    // Add timestamps
    const documentData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    if (id) {
      await setDoc(doc(db, collectionName, id), documentData)
      return id
    } else {
      // Generate auto ID by creating a doc reference
      const newDocRef = doc(collectionRef)
      await setDoc(newDocRef, documentData)
      return newDocRef.id
    }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Update a document
 */
export async function updateDocument<T = DocumentData>(
  collectionName: CollectionName,
  id: string,
  data: Partial<WithFieldValue<T>>
): Promise<void> {
  try {
    const db = getFirebaseDb()
    const docRef = doc(db, collectionName, id)

    // Add updated timestamp
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, updateData)
  } catch (error) {
    console.error(`Error updating document ${id} in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(
  collectionName: CollectionName,
  id: string
): Promise<void> {
  try {
    const db = getFirebaseDb()
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document ${id} from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Convert Firestore Timestamps to ISO strings
 */
function convertTimestampsToISO<T>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data
  }

  const result: any = {}

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString()
    } else if (Array.isArray(value)) {
      result[key] = value.map(item =>
        item instanceof Timestamp ? item.toDate().toISOString() : convertTimestampsToISO(item)
      )
    } else if (typeof value === 'object' && value !== null) {
      result[key] = convertTimestampsToISO(value)
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Query helpers
 */
export const dbQuery = {
  where: where,
  orderBy: orderBy,
  limit: limit,
}