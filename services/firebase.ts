import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCbvHfpUymtujJ_ArzK7j-ajI9ibvmrrqY",
  authDomain: "study-mate-app-7887a.firebaseapp.com",
  projectId: "study-mate-app-7887a",
  storageBucket: "study-mate-app-7887a.firebasestorage.app",
  messagingSenderId: "714814369200",
  appId: "1:714814369200:web:dbec6fadfddd7d991e7a75"
};

const app = initializeApp(firebaseConfig)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app)
export const storage = getStorage(app)