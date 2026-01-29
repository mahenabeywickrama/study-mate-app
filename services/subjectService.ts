import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from './firebase'
import { Subject } from '../types/subjects'

const auth = getAuth()
const subjectsCollection = collection(db, 'subjects')

// ---------------------------------------------------------
// CREATE
// ---------------------------------------------------------
export const addSubject = async (name: string, color?: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  await addDoc(subjectsCollection, {
    name,
    color: color ?? null,
    userId: user.uid,
    createdAt: new Date().toISOString()
  })
}

// ---------------------------------------------------------
// READ (ALL)
// ---------------------------------------------------------
export const getAllSubjects = async (): Promise<Subject[]> => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const q = query(
    subjectsCollection,
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()

    return {
      id: docSnap.id,
      name: data.name ?? '',
      color: data.color ?? undefined,
      userId: data.userId
    }
  })
}

// ---------------------------------------------------------
// READ (BY ID)
// ---------------------------------------------------------
export const getSubjectById = async (id: string): Promise<Subject> => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'subjects', id)
  const subjectDoc = await getDoc(ref)

  if (!subjectDoc.exists()) throw new Error('Subject not found')

  const data = subjectDoc.data()
  if (data.userId !== user.uid) throw new Error('Unauthorized')

  return {
    id: subjectDoc.id,
    name: data.name ?? '',
    color: data.color ?? undefined,
    userId: data.userId
  }
}

// ---------------------------------------------------------
// UPDATE
// ---------------------------------------------------------
export const updateSubject = async (
  id: string,
  name: string,
  color?: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'subjects', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Subject not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await updateDoc(ref, {
    name,
    color: color ?? null
  })
}

// ---------------------------------------------------------
// DELETE
// ---------------------------------------------------------
export const deleteSubject = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'subjects', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Subject not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await deleteDoc(ref)
}
