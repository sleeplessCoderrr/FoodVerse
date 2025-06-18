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
  // Upload and validate face image using AI service
  async uploadFaceImage(file: File): Promise<string> {
    // First, validate the image using the AI service
    const formData = new FormData()
    formData.append('image', file)
    formData.append('confidence_threshold', '0.7') // Higher threshold for better accuracy

    try {
      // Call the Flask AI service for face validation
      const aiResponse = await fetch('https://n9nmdjqd-50006.asse.devtunnels.ms/api/v1/face-recognition/classify', {
        method: 'POST',
        body: formData
      })

      if (!aiResponse.ok) {
        throw new Error(`AI service error: ${aiResponse.status}`)
      }

      const aiResult = await aiResponse.json()
      
      // Check if the AI service detected a human face
      if (!aiResult.success) {
        throw new Error(aiResult.message || 'Failed to process image')
      }

      if (!aiResult.is_human) {
        throw new Error(`Please upload a clear photo of your face. AI confidence: ${(aiResult.confidence * 100).toFixed(1)}%`)
      }

      // If AI validation passes, create a data URL for the validated image
      // In a real application, you would upload to cloud storage here
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to process image file'))
        reader.readAsDataURL(file)
      })

    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to validate face image. Please ensure the AI service is running.')
    }
  }
}
