import api from './api'

export interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  user_type: 'consumer' | 'seller' | 'admin'
  address?: string
  created_at: string
  updated_at: string
}

export const userService = {
  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/user')
    return response.data
  },

  // Update user profile
  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    const response = await api.put<User>('/user', profileData)
    return response.data
  },

  // Change password
  async changePassword(passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/user/change-password', passwordData)
    return response.data
  },

  // Get user statistics
  async getUserStats(): Promise<{
    total_orders: number
    completed_orders: number
    total_savings: number
    favorite_categories: string[]
  }> {
    const response = await api.get('/user/stats')
    return response.data
  }
}

export default userService
