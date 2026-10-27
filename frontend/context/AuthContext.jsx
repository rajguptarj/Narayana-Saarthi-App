import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { auth } from "../config/firebase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const googleProvider = useMemo(() => new GoogleAuthProvider(), [])

  const value = useMemo(
    () => ({
      user,
      loading,
      register: (email, password) =>
        createUserWithEmailAndPassword(auth, email, password),
      login: (email, password) => signInWithEmailAndPassword(auth, email, password),
      loginWithGoogle: () => signInWithPopup(auth, googleProvider),
      logout: () => signOut(auth),
      deleteAccount: () => {
        if (!auth.currentUser) {
          throw new Error("No authenticated user found.")
        }
        return deleteUser(auth.currentUser)
      },
    }),
    [user, loading, googleProvider]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
