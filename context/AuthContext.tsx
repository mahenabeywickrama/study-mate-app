import { useLoader } from "@/hooks/useLoader"
import { auth } from "@/services/firebase"
import { createProfileIfNotExists } from "@/services/profilesService"
import { onAuthStateChanged, User } from "firebase/auth"
import { createContext, ReactNode, useEffect, useState } from "react"

interface AuthContextType {
  user: User | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { showLoader, hideLoader, isLoading } = useLoader()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    showLoader()
    const unsucribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr)
      if (usr) {
        await createProfileIfNotExists()
      }
      hideLoader()
    })

    // cleanup function (component unmount)
    return () => unsucribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
