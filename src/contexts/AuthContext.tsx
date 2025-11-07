import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN_KEY, ROLE_KEY } from '../constants/storage'

type UserRole = 'teacher' | 'student' | null

interface AuthContextValue {
  token: string | null
  role: UserRole
  isTeacher: boolean
  isStudent: boolean
  login: (token: string, role: Exclude<UserRole, null>) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY),
  )
  const [role, setRole] = useState<UserRole>(() => {
    const storedRole = localStorage.getItem(ROLE_KEY)
    return storedRole === 'teacher' || storedRole === 'student'
      ? storedRole
      : null
  })

  const login = useCallback(
    (authToken: string, userRole: Exclude<UserRole, null>) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, authToken)
      localStorage.setItem(ROLE_KEY, userRole)
      setToken(authToken)
      setRole(userRole)
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    setToken(null)
    setRole(null)
    navigate('/', { replace: true })
  }, [navigate])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === ACCESS_TOKEN_KEY) {
        setToken(event.newValue)
      }
      if (event.key === ROLE_KEY) {
        const nextRole =
          event.newValue === 'teacher' || event.newValue === 'student'
            ? event.newValue
            : null
        setRole(nextRole)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      role,
      isTeacher: role === 'teacher',
      isStudent: role === 'student',
      login,
      logout,
    }),
    [login, logout, role, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
