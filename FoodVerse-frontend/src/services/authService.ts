import api from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone?: string
  user_type?: 'consumer' | 'business'
  address?: string
}

export interface AuthResponse {
  token: string
  expires_at: string
  user: {
    id: number
    name: string
    email: string
    phone?: string
    user_type: 'consumer' | 'business'
    address?: string
    created_at: string
    updated_at: string
  }
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  user_type: 'consumer' | 'business'
  address?: string
  created_at: string
  updated_at: string
}

export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials)
    return response.data
  },

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', userData)
    return response.data
  },
  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/user')
    return response.data
  },

  // Logout user
  logout(): void {
    localStorage.removeItem('foodverse-auth-token')
    localStorage.removeItem('foodverse-user')
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('foodverse-auth-token')
    return !!token
  },

  // Get stored user data
  getStoredUser(): User | null {
    const userData = localStorage.getItem('foodverse-user')
    return userData ? JSON.parse(userData) : null
  },
  // Store auth data
  storeAuthData(data: AuthResponse): void {
    localStorage.setItem('foodverse-auth-token', data.token)
    localStorage.setItem('foodverse-user', JSON.stringify(data.user))
  }
}

export default authService
