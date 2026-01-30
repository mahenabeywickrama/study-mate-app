// services/profileService.ts

import { getAuth } from "firebase/auth"
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore"
import { db } from "./firebase"
import { Profile } from "@/types/profiles"

const auth = getAuth()

// ---------------------------------------------------------
// CREATE (on first login / register)
// ---------------------------------------------------------
export const createProfileIfNotExists = async (name?: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const ref = doc(db, "profiles", user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) return // already created

  await setDoc(ref, {
    name: name ?? user.displayName ?? "",
    email: user.email ?? "",
    avatarUrl: user.photoURL ?? null,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

// ---------------------------------------------------------
// READ (current user)
// ---------------------------------------------------------
export const getMyProfile = async (): Promise<Profile> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const ref = doc(db, "profiles", user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Profile not found")

  const data = snap.data()

  return {
    id: snap.id,
    name: data.name ?? "",
    email: data.email ?? "",
    avatarUrl: data.avatarUrl ?? undefined,
    userId: data.userId
  }
}

// ---------------------------------------------------------
// UPDATE
// ---------------------------------------------------------
export const updateMyProfile = async (
  name: string,
  avatarUrl?: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const ref = doc(db, "profiles", user.uid)

  await updateDoc(ref, {
    name,
    avatarUrl: avatarUrl ?? null,
    updatedAt: serverTimestamp()
  })
}
