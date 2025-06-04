import api from './api'
import type { Store } from './storeService'

export interface FoodBag {
  id: number
  title: string
  description: string
  original_price: number
  discounted_price: number
  discount_percent: number
  quantity_left: number
  pickup_time_start: string
  pickup_time_end: string
  image_url?: string
  category: string
  store: Store
  created_at: string
  updated_at: string
}

export interface FoodBagInput {
  store_id: number
  title: string
  description: string
  original_price: number
  discounted_price: number
  quantity_total: number
  pickup_time_start: string
  pickup_time_end: string
  image_url?: string
  category: string
}

export interface FoodBagSearchRequest {
  latitude: number
  longitude: number
  radius?: number
  category?: string
  max_price?: number
  min_price?: number
}

export const foodBagService = {
  // Search food bags for consumers
  async searchFoodBags(searchParams: FoodBagSearchRequest): Promise<{ data: FoodBag[] }> {
    const response = await api.post<FoodBag[]>('/food-bags/search', searchParams)
    return { data: response.data }
  },

  // Get food bag by ID
  async getFoodBag(id: number): Promise<{ data: FoodBag }> {
    const response = await api.get<FoodBag>(`/food-bags/${id}`)
    return { data: response.data }
  },

  // Create food bag (business owner only)
  async createFoodBag(foodBagData: FoodBagInput): Promise<{ data: FoodBag }> {
    const response = await api.post<FoodBag>('/food-bags', foodBagData)
    return { data: response.data }
  },

  // Update food bag (business owner only)
  async updateFoodBag(id: number, foodBagData: Partial<FoodBagInput>): Promise<{ data: FoodBag }> {
    const response = await api.put<FoodBag>(`/food-bags/${id}`, foodBagData)
    return { data: response.data }
  },

  // Delete food bag (business owner only)
  async deleteFoodBag(id: number): Promise<void> {
    await api.delete(`/food-bags/${id}`)
  },

  // Get food bags for a specific store
  async getFoodBagsByStore(storeId: number): Promise<{ data: FoodBag[] }> {
    const response = await api.get<FoodBag[]>(`/store-food-bags/${storeId}`)
    return { data: response.data }
  }
}

export default foodBagService
