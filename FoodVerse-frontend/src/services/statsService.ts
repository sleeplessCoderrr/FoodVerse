import { storeService, type Store } from './storeService'
import { foodBagService, type FoodBag } from './foodBagService'

export interface AppStats {
  totalUsers: number
  totalStores: number
  totalMealsSaved: number
  totalFoodWastePrevented: string // in tons
}

export interface FeaturedStore {
  id: number
  name: string
  category: string
  rating: number
  image_url?: string
  address: string
}

export interface RecentActivity {
  totalOrdersToday: number
  activeFoodBags: number
  featuredStores: FeaturedStore[]
}

class StatsService {
  async getAppStats(): Promise<AppStats> {
    try {
      // Get stores count using search (we'll use a default search to get all stores)
      const storesResponse = await storeService.searchStores({
        latitude: -6.2088, // Jakarta coordinates as default
        longitude: 106.8456,
        radius: 50000 // Large radius to get most stores
      })
      const totalStores = storesResponse.data.length

      // For demo purposes, we'll calculate some stats based on available data
      // In a real app, these would be separate API endpoints
      
      // Estimate users based on stores (rough calculation)
      const totalUsers = Math.floor(totalStores * 30) // Average 30 users per store

      // Estimate meals saved (rough calculation)
      const totalMealsSaved = Math.floor(totalStores * 200) // Average 200 meals saved per store

      // Estimate food waste prevented (rough calculation)
      const wasteInKg = totalMealsSaved * 0.4 // Average 400g per meal
      const wasteInTons = (wasteInKg / 1000).toFixed(0)

      return {
        totalUsers,
        totalStores,
        totalMealsSaved,
        totalFoodWastePrevented: `${wasteInTons} tons`
      }
    } catch (error) {
      console.error('Error fetching app stats:', error)
      // Return fallback stats
      return {
        totalUsers: 25000,
        totalStores: 800,
        totalMealsSaved: 150000,
        totalFoodWastePrevented: '250 tons'
      }
    }
  }

  async getRecentActivity(): Promise<RecentActivity> {
    try {
      // Get food bags to count active ones
      const foodBagsResponse = await foodBagService.searchFoodBags({
        latitude: -6.2088,
        longitude: 106.8456,
        radius: 50000
      })
      const activeFoodBags = foodBagsResponse.data.filter((bag: FoodBag) => bag.quantity_left > 0).length

      // Get featured stores (top rated ones)
      const storesResponse = await storeService.searchStores({
        latitude: -6.2088,
        longitude: 106.8456,
        radius: 50000
      })
      const featuredStores: FeaturedStore[] = storesResponse.data
        .sort((a: Store, b: Store) => b.rating - a.rating)
        .slice(0, 6)
        .map((store: Store) => ({
          id: store.id,
          name: store.name,
          category: store.category,
          rating: store.rating,
          image_url: store.image_url,
          address: store.address
        }))

      // Estimate orders today based on active food bags
      const totalOrdersToday = Math.floor(activeFoodBags * 0.3) // 30% conversion rate

      return {
        totalOrdersToday,
        activeFoodBags,
        featuredStores
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return {
        totalOrdersToday: 0,
        activeFoodBags: 0,
        featuredStores: []
      }
    }
  }

  async getFeaturedStores(): Promise<FeaturedStore[]> {
    try {
      const storesResponse = await storeService.searchStores({
        latitude: -6.2088,
        longitude: 106.8456,
        radius: 50000
      })
      return storesResponse.data
        .sort((a: Store, b: Store) => b.rating - a.rating)
        .slice(0, 8)
        .map((store: Store) => ({
          id: store.id,
          name: store.name,
          category: store.category,
          rating: store.rating,
          image_url: store.image_url,
          address: store.address
        }))
    } catch (error) {
      console.error('Error fetching featured stores:', error)
      return []
    }
  }
}

export const statsService = new StatsService()
