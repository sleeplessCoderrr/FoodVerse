import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService, type User } from '@/services/authService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, userType: 'consumer' | 'business', phone?: string, address?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated on app start
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser()
          if (storedUser) {
            setUser(storedUser)          } else {
            // Fetch fresh user data from API
            const userData = await authService.getProfile()
            setUser(userData)
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        authService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.login({ email, password })
      authService.storeAuthData(response)
      setUser(response.user)
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, userType: 'consumer' | 'business', phone?: string, address?: string) => {
    setIsLoading(true)
    try {
      const response = await authService.register({ name, email, password, user_type: userType, phone, address })
      authService.storeAuthData(response)
      setUser(response.user)
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
