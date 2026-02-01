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
import { uploadImageToCloudinary } from "@/utils/cloudinary"

const auth = getAuth()

// ---------------------------------------------------------
// CREATE
// ---------------------------------------------------------
export const createProfileIfNotExists = async (name?: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const ref = doc(db, "profiles", user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) return

  await setDoc(ref, {
    name: name ?? user.displayName ?? "",
    email: user.email ?? "",
    photoUrl: user.photoURL ?? null,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

// ---------------------------------------------------------
// READ
// ---------------------------------------------------------
export const getMyProfile = async (): Promise<Profile> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  const snap = await getDoc(doc(db, "profiles", user.uid))
  if (!snap.exists()) throw new Error("Profile not found")

  const data = snap.data()

  return {
    id: snap.id,
    name: data.name ?? "",
    email: data.email ?? "",
    photoUrl: data.photoUrl ?? undefined,
    userId: data.userId
  }
}

// ---------------------------------------------------------
// UPDATE NAME
// ---------------------------------------------------------
export const updateMyProfile = async (name: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated.")

  await updateDoc(doc(db, "profiles", user.uid), {
    name,
    updatedAt: serverTimestamp()
  })
}

// ---------------------------------------------------------
// UPDATE PHOTO (Cloudinary only)
// ---------------------------------------------------------
export const updateProfilePhoto = async (localUri: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("Not logged in")

  const imageUrl = await uploadImageToCloudinary(localUri)

  await updateDoc(doc(db, "profiles", user.uid), {
    photoUrl: imageUrl, // ✅ consistent naming
    updatedAt: serverTimestamp()
  })

  return imageUrl
}
