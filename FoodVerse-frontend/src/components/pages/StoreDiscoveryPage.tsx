import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Filter, Clock, Star, Heart, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { storeService, type Store, type StoreSearchRequest } from '@/services/storeService'
import { foodBagService, type FoodBag } from '@/services/foodBagService'
import { useToast } from '@/components/shared/ToastProvider'

const FOOD_CATEGORIES = [
  { id: 'all', name: 'All Categories', emoji: '🍽️' },
  { id: 'bakery', name: 'Bakery', emoji: '🥖' },
  { id: 'restaurant', name: 'Restaurant', emoji: '🍽️' },
  { id: 'grocery', name: 'Grocery', emoji: '🛒' },
  { id: 'cafe', name: 'Café', emoji: '☕' },
]

const SAMPLE_LOCATIONS = [
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Surabaya, Indonesia', lat: -7.2575, lng: 112.7521 },
  { name: 'Bandung, Indonesia', lat: -6.9175, lng: 107.6191 },
  { name: 'Medan, Indonesia', lat: 3.5952, lng: 98.6722 },
]

export function StoreDiscoveryPage() {
  const navigate = useNavigate()
  const [stores, setStores] = useState<Store[]>([])
  const [foodBags, setFoodBags] = useState<Record<number, FoodBag[]>>({})
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [location, setLocation] = useState('')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const { addToast } = useToast()

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setLocation('Current Location')
          searchStores(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          addToast({
            type: 'error',
            title: 'Location Error',
            message: 'Could not get your current location. Using default search.'
          })
          // Default to Jakarta
          const defaultLocation = SAMPLE_LOCATIONS[0]
          setUserLocation({ lat: defaultLocation.lat, lng: defaultLocation.lng })
          searchStores(defaultLocation.lat, defaultLocation.lng)
        }
      )
    } else {
      addToast({
        type: 'error',
        title: 'Geolocation Not Supported',
        message: 'Your browser does not support geolocation.'
      })
      // Default to Jakarta
      const defaultLocation = SAMPLE_LOCATIONS[0]
      setUserLocation({ lat: defaultLocation.lat, lng: defaultLocation.lng })
      searchStores(defaultLocation.lat, defaultLocation.lng)
    }
  }

  // Search stores based on location and filters
  const searchStores = async (lat: number, lng: number, category?: string, query?: string) => {
    setLoading(true)
    try {
      const searchParams: StoreSearchRequest = {
        latitude: lat,
        longitude: lng,
        radius: 10, // 10km radius
      }

      if (category && category !== 'all') {
        searchParams.category = category
      }

      if (query) {
        searchParams.query = query
      }

      const response = await storeService.searchStores(searchParams)
      setStores(response.data)

      // Load food bags for each store
      const foodBagPromises = response.data.map(async (store) => {
        try {
          const foodBagResponse = await foodBagService.getFoodBagsByStore(store.id)
          return { storeId: store.id, foodBags: foodBagResponse.data }
        } catch (error) {
          return { storeId: store.id, foodBags: [] }
        }
      })

      const foodBagResults = await Promise.all(foodBagPromises)
      const foodBagMap: Record<number, FoodBag[]> = {}
      foodBagResults.forEach(({ storeId, foodBags }) => {
        foodBagMap[storeId] = foodBags
      })
      setFoodBags(foodBagMap)

    } catch (error) {
      console.error('Error searching stores:', error)
      addToast({
        type: 'error',
        title: 'Search Error',
        message: 'Failed to load stores. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle location selection
  const handleLocationSelect = (selectedLocation: { name: string; lat: number; lng: number }) => {
    setLocation(selectedLocation.name)
    setUserLocation({ lat: selectedLocation.lat, lng: selectedLocation.lng })
    searchStores(selectedLocation.lat, selectedLocation.lng, selectedCategory, searchQuery)
  }

  // Handle search
  const handleSearch = () => {
    if (userLocation) {
      searchStores(userLocation.lat, userLocation.lng, selectedCategory, searchQuery)
    }
  }

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    if (userLocation) {
      searchStores(userLocation.lat, userLocation.lng, category, searchQuery)
    }
  }

  // Toggle favorite
  const toggleFavorite = (storeId: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(storeId)) {
      newFavorites.delete(storeId)
    } else {
      newFavorites.add(storeId)
    }
    setFavorites(newFavorites)
  }

  // Calculate discount percentage
  const calculateDiscount = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100)
  }

  // Format pickup time
  const formatPickupTime = (start: string, end: string) => {
    const startTime = new Date(start).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    const endTime = new Date(end).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    return `${startTime} - ${endTime}`
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0EEE6] via-[#F0EEE6] to-[#F5F3ED] dark:from-[#262624] dark:via-[#2A2A28] dark:to-[#1E1E1C]">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Location Picker */}
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <select 
                value={location}
                onChange={(e) => {
                  const selected = SAMPLE_LOCATIONS.find(loc => loc.name === e.target.value)
                  if (selected) {
                    handleLocationSelect(selected)
                  }
                }}
                className="bg-transparent border-none outline-none text-foreground text-sm font-medium cursor-pointer"
              >
                <option value="">Select Location</option>
                <option value="Current Location">Current Location</option>
                {SAMPLE_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={getCurrentLocation}
                className="text-primary"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search stores or food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4"
                />
                <Button
                  onClick={handleSearch}
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Browse by Category</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {FOOD_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryFilter(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Store Grid */}
        <AnimatePresence>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass-card animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No stores found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >                  <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate(`/stores/${store.id}`)}>
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="text-4xl">
                          {FOOD_CATEGORIES.find(cat => cat.id === store.category)?.emoji || '🏪'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(store.id)
                        }}
                        className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                      >
                        <Heart className={`h-4 w-4 ${favorites.has(store.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                      </Button>
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {store.category}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground text-lg line-clamp-1">{store.name}</h3>
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-muted-foreground">{store.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{store.description}</p>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{store.address}</span>
                        {store.distance && (
                          <span className="text-primary font-medium">
                            {store.distance.toFixed(1)}km
                          </span>
                        )}
                      </div>

                      {/* Food Bags Preview */}
                      {foodBags[store.id] && foodBags[store.id].length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-foreground">Available Now:</h4>
                          {foodBags[store.id].slice(0, 2).map((bag) => (
                            <div key={bag.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-foreground line-clamp-1">{bag.title}</p>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatPickupTime(bag.pickup_time_start, bag.pickup_time_end)}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-muted-foreground line-through">
                                    ${bag.original_price.toFixed(2)}
                                  </span>
                                  <span className="font-bold text-primary">
                                    ${bag.discounted_price.toFixed(2)}
                                  </span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {calculateDiscount(bag.original_price, bag.discounted_price)}% off
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {foodBags[store.id].length > 2 && (
                            <p className="text-xs text-muted-foreground text-center">
                              +{foodBags[store.id].length - 2} more items
                            </p>
                          )}
                        </div>
                      )}                      <Button className="w-full mt-4" onClick={() => {
                        navigate(`/stores/${store.id}`)
                      }}>
                        View Store
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
