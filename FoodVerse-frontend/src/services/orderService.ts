import api from './api'
import type { FoodBag } from './foodBagService'
import type { Store } from './storeService'

export interface Order {
  id: number
  user_id: number
  food_bag_id: number
  store_id: number
  quantity: number
  total_price: number
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
  notes?: string
  pickup_code?: string
  created_at: string
  updated_at: string
  food_bag?: FoodBag
  store?: Store
}

export interface OrderInput {
  food_bag_id: number
  quantity: number
  notes?: string
}

export interface OrderStatusUpdate {
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
}

export interface PickupVerification {
  pickup_code: string
}

export const orderService = {
  // Create a new order (consumer)
  async createOrder(orderData: OrderInput): Promise<{ data: Order }> {
    const response = await api.post<Order>('/orders', orderData)
    return { data: response.data }
  },

  // Get order by ID
  async getOrder(id: number): Promise<{ data: Order }> {
    const response = await api.get<Order>(`/orders/${id}`)
    return { data: response.data }
  },

  // Get user's orders (consumer)
  async getMyOrders(): Promise<{ data: Order[] }> {
    const response = await api.get<Order[]>('/orders/my')
    return { data: response.data }
  },

  // Update order status (business owner)
  async updateOrderStatus(id: number, statusData: OrderStatusUpdate): Promise<{ data: Order }> {
    const response = await api.put<Order>(`/orders/${id}/status`, statusData)
    return { data: response.data }
  },

  // Verify pickup code (business owner)
  async verifyPickupCode(pickupData: PickupVerification): Promise<{ data: Order }> {
    const response = await api.post<Order>('/orders/verify-pickup', pickupData)
    return { data: response.data }
  },

  // Get orders for a store (business owner)
  async getStoreOrders(storeId: number): Promise<{ data: Order[] }> {
    const response = await api.get<Order[]>(`/store/${storeId}/orders`)
    return { data: response.data }
  }
}

export default orderService
