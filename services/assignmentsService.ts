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
import { Assignment } from '@/types/assignments'

const auth = getAuth()
const assignmentsCollection = collection(db, 'assignments')

/* ---------------------------------------------------------
   CREATE
--------------------------------------------------------- */
export const addAssignment = async (
  title: string,
  dueDate: string,
  subjectId: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  await addDoc(assignmentsCollection, {
    title,
    dueDate,
    subjectId,
    completed: false,
    userId: user.uid,
    createdAt: new Date().toISOString()
  })
}

/* ---------------------------------------------------------
   READ (ALL)
--------------------------------------------------------- */
export const getAllAssignments = async (): Promise<Assignment[]> => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const q = query(
    assignmentsCollection,
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()

    return {
      id: docSnap.id,
      title: data.title ?? '',
      dueDate: data.dueDate ?? '',
      subjectId: data.subjectId ?? '',
      completed: data.completed ?? false,
      userId: data.userId
    }
  })
}

/* ---------------------------------------------------------
   READ (BY SUBJECT)
--------------------------------------------------------- */
export const getAssignmentsBySubject = async (
  subjectId: string
): Promise<Assignment[]> => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const q = query(
    assignmentsCollection,
    where('userId', '==', user.uid),
    where('subjectId', '==', subjectId),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()

    return {
      id: docSnap.id,
      title: data.title,
      dueDate: data.dueDate,
      subjectId: data.subjectId,
      completed: data.completed,
      userId: data.userId
    }
  })
}

/* ---------------------------------------------------------
   READ (BY ID)
--------------------------------------------------------- */
export const getAssignmentById = async (id: string): Promise<Assignment> => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'assignments', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Assignment not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  const data = snap.data()

  return {
    id: snap.id,
    title: data.title,
    dueDate: data.dueDate,
    subjectId: data.subjectId,
    completed: data.completed,
    userId: data.userId
  }
}

/* ---------------------------------------------------------
   UPDATE
--------------------------------------------------------- */
export const updateAssignment = async (
  id: string,
  title: string,
  dueDate: string,
  subjectId: string,
  completed: boolean
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'assignments', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Assignment not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await updateDoc(ref, {
    title,
    dueDate,
    subjectId,
    completed
  })
}

/* ---------------------------------------------------------
   TOGGLE COMPLETED
--------------------------------------------------------- */
export const toggleAssignmentCompleted = async (
  id: string,
  completed: boolean
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'assignments', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Assignment not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await updateDoc(ref, { completed })
}

/* ---------------------------------------------------------
   DELETE
--------------------------------------------------------- */
export const deleteAssignment = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'assignments', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Assignment not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await deleteDoc(ref)
}
