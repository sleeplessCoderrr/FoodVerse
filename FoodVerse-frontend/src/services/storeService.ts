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
  distance?: number
  created_at: string
  updated_at: string
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

  // Get store by ID
  async getStore(id: number): Promise<{ data: Store }> {
    const response = await api.get<Store>(`/stores/${id}`)
    return { data: response.data }
  },

  // Create store (business owner only)
  async createStore(storeData: StoreInput): Promise<{ data: Store }> {
    const response = await api.post<Store>('/stores', storeData)
    return { data: response.data }
  },

  // Update store (business owner only)
  async updateStore(id: number, storeData: Partial<StoreInput>): Promise<{ data: Store }> {
    const response = await api.put<Store>(`/stores/${id}`, storeData)
    return { data: response.data }
  },

  // Delete store (business owner only)
  async deleteStore(id: number): Promise<void> {
    await api.delete(`/stores/${id}`)
  },
  // Get stores owned by current user (business owner only)
  async getOwnedStores(): Promise<{ data: Store[] }> {
    const response = await api.get<Store[]>('/stores/my')
    return { data: response.data }
  }
}

export default storeService
