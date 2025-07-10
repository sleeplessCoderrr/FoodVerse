import api from './api'

export interface Store {
  id: number
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  phone?: string
  email?: string
  category: string
  image_url?: string
  rating: number
  is_active: boolean
  distance?: number
  created_at: string
  updated_at: string
}

export interface StoreSearchRequest {
  latitude: number
  longitude: number
  radius?: number // in kilometers, default 5km
  category?: string
  query?: string
}

export interface StoreInput {
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  phone?: string
  email?: string
  category: string
  image_url?: string
}

export interface StoreSearchRequest {
  latitude: number
  longitude: number
  radius?: number
  category?: string
  query?: string
}

export const storeService = {
  // Get all stores for consumer (with location-based search)
  async searchStores(searchParams: StoreSearchRequest): Promise<{ data: Store[] }> {
    const response = await api.post<Store[]>('/stores/search', searchParams)
    return { data: response.data }
  },

  // Get all stores (for browsing without location)
  async getAllStores(): Promise<{ data: Store[] }> {
    // Use a default location-based search with wide radius
    const response = await api.post<Store[]>('/stores/search', {
      latitude: 0,
      longitude: 0,
      radius: 10000 // Very wide radius to get all stores
    })
    return { data: response.data }
  },

  // Get stores by category
  async getStoresByCategory(category: string): Promise<{ data: Store[] }> {
    const response = await api.post<Store[]>('/stores/search', {
      latitude: 0,
      longitude: 0,
      radius: 10000,
      category
    })
    return { data: response.data }
  },

  // Get store by ID
  async getStore(id: number): Promise<{ data: Store }> {
    const response = await api.get<Store>(`/stores/${id}`)
    return { data: response.data }
  },

  // Create store (seller only)
  async createStore(storeData: StoreInput): Promise<{ data: Store }> {
    const response = await api.post<Store>('/stores', storeData)
    return { data: response.data }
  },

  // Update store (seller only)
  async updateStore(id: number, storeData: Partial<StoreInput>): Promise<{ data: Store }> {
    const response = await api.put<Store>(`/stores/${id}`, storeData)
    return { data: response.data }
  },
  // Delete store (seller only)
  async deleteStore(id: number): Promise<void> {
    await api.delete(`/stores/${id}`)
  },

  // Toggle store status (seller only)
  async toggleStoreStatus(id: number): Promise<{ data: Store }> {
    const response = await api.patch<Store>(`/stores/${id}/toggle-status`)
    return { data: response.data }
  },

  // Get stores owned by current user (business owner only)
  async getOwnedStores(): Promise<{ data: Store[] }> {
    const response = await api.get<Store[]>('/stores/my')
    return { data: response.data }
  }
}

export default storeService
