import api from './api'

export interface SellerRequest {
  id: number
  user: {
    id: number
    name: string
    email: string
    user_type: string
  }
  id_number: string
  reason: string
  location: string
  face_image_url: string
  status: 'pending' | 'approved' | 'rejected'
  admin_comments: string
  reviewed_by?: {
    id: number
    name: string
    email: string
  }
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface SellerRequestInput {
  id_number: string
  reason: string
  location: string
  face_image_url: string
}

export interface SellerRequestUpdateInput {
  status: 'approved' | 'rejected'
  admin_comments: string
}

export const sellerRequestService = {
  // Create a seller request
  async createSellerRequest(data: SellerRequestInput): Promise<SellerRequest> {
    const response = await api.post('/seller-requests', data)
    return response.data
  },

  // Get current user's seller request
  async getMySellerRequest(): Promise<SellerRequest> {
    const response = await api.get('/seller-requests/my')
    return response.data
  },

  // Get all seller requests (admin only)
  async getSellerRequests(params?: { 
    status?: string 
    page?: number 
    limit?: number 
  }): Promise<{
    requests: SellerRequest[]
    total: number
    page: number
    limit: number
  }> {
    const response = await api.get('/seller-requests', { params })
    return response.data
  },

  // Update seller request (admin only)
  async updateSellerRequest(id: number, data: SellerRequestUpdateInput): Promise<SellerRequest> {
    const response = await api.put(`/seller-requests/${id}`, data)
    return response.data
  },

  // Upload face image (placeholder - you'll need to implement file upload)
  async uploadFaceImage(file: File): Promise<string> {
    // This would typically upload to a cloud storage service
    // For now, return a placeholder URL
    return Promise.resolve(`https://example.com/uploads/${file.name}`)
  }
}
