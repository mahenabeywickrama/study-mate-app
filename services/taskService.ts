// taskService.ts

import { getAuth } from "firebase/auth"
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
} from "firebase/firestore"
import { db } from "./firebase"
import { Task } from "@/types/tasks"

const auth = getAuth()
const tasksCollection = collection(db, "tasks")

// --------------------------------------------------
// CREATE
// --------------------------------------------------
export const addTask = async (
  title: string,
  description: string,
  subjectId: string,
  date: string,
  priority: "High" | "Medium" | "Low"
) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  await addDoc(tasksCollection, {
    title,
    description,
    subjectId,
    date,
    priority,
    completed: false,
    userId: user.uid
  })
}

// --------------------------------------------------
// READ (ALL)
// --------------------------------------------------
export const getAllTasks = async (): Promise<Task[]> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const q = query(
    tasksCollection,
    where("userId", "==", user.uid),
    orderBy("date", "asc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()

    return {
      id: docSnap.id,
      title: data.title ?? "",
      description: data.description ?? "",
      subjectId: data.subjectId ?? "",
      date: data.date ?? "",
      priority: data.priority ?? "Medium",
      completed: data.completed ?? false,
      userId: data.userId
    }
  })
}

// --------------------------------------------------
// READ (BY ID)
// --------------------------------------------------
export const getTaskById = async (id: string): Promise<Task> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const ref = doc(db, "tasks", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Task not found")
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized")

  const data = snap.data()

  return {
    id: snap.id,
    title: data.title,
    description: data.description,
    subjectId: data.subjectId,
    date: data.date,
    priority: data.priority,
    completed: data.completed,
    userId: data.userId
  }
}

// --------------------------------------------------
// UPDATE
// --------------------------------------------------
export const updateTask = async (
  id: string,
  updates: Partial<Omit<Task, "id" | "userId">>
) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const ref = doc(db, "tasks", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Task not found")
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized")

  await updateDoc(ref, updates)
}

// --------------------------------------------------
// TOGGLE COMPLETE
// --------------------------------------------------
export const setTaskCompleted = async (
  id: string,
  completed: boolean
) => {
  await updateTask(id, { completed })
}

// --------------------------------------------------
// DELETE
// --------------------------------------------------
export const deleteTask = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const ref = doc(db, "tasks", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Task not found")
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized")

  await deleteDoc(ref)
}

// --------------------------------------------------
// FILTERS
// --------------------------------------------------
export const getTasksByStatus = async (
  completed: boolean
): Promise<Task[]> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const q = query(
    tasksCollection,
    where("userId", "==", user.uid),
    where("completed", "==", completed),
    orderBy("date", "asc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Task, "id">)
  }))
}
