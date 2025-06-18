import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/shared/ToastProvider'
import { AuthenticatedLayout } from '@/components/shared/AuthenticatedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, Star, Search, ShoppingBag, Plus, Minus, TrendingUp, Heart, Gift } from 'lucide-react'
import { storeService, type Store } from '@/services/storeService'
import { foodBagService, type FoodBag } from '@/services/foodBagService'
import { orderService } from '@/services/orderService'
import { userService } from '@/services/userService'
import { formatIDR } from '@/lib/utils'

export function ConsumerDashboard() {
  const navigate = useNavigate()
  const [stores, setStores] = useState<Store[]>([])
  const [foodBags, setFoodBags] = useState<FoodBag[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userStats, setUserStats] = useState<any>(null)
    // Order dialog state
  const [selectedFoodBag, setSelectedFoodBag] = useState<FoodBag | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [orderNotes, setOrderNotes] = useState('')
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  
  const { addToast } = useToast()

  const categories = [
    'All',
    'bakery',
    'restaurant', 
    'grocery',
    'cafe'
  ]
  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Default to Jakarta coordinates if location access denied
          setUserLocation({ lat: -6.2088, lng: 106.8456 })
        }
      )
    } else {
      // Default location if geolocation not supported
      setUserLocation({ lat: -6.2088, lng: 106.8456 })
    }

    // Load user stats
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    try {
      const stats = await userService.getUserStats()
      setUserStats(stats)
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  useEffect(() => {
    if (userLocation) {
      loadNearbyData()
    }
  }, [userLocation, selectedCategory, searchQuery])

  const loadNearbyData = async () => {
    if (!userLocation) return
    
    setIsLoading(true)
    try {
      // Search for stores
      const storeParams = {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        radius: 10, // 10km radius
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        query: searchQuery || undefined
      }
      const storesResponse = await storeService.searchStores(storeParams)
      setStores(storesResponse.data)

      // Search for food bags
      const foodBagParams = {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        radius: 10,
        category: selectedCategory === 'All' ? undefined : selectedCategory
      }
      const foodBagsResponse = await foodBagService.searchFoodBags(foodBagParams)
      setFoodBags(foodBagsResponse.data)
    } catch (error) {
      console.error('Error loading data:', error)
      addToast({
        type: 'error',
        message: 'Failed to load nearby stores and food bags'
      })
    } finally {
      setIsLoading(false)
    }
  }
  const formatDistance = (distance?: number) => {
    if (!distance) return ''
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
  }
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleOrderFood = async () => {
    if (!selectedFoodBag) return

    setIsCreatingOrder(true)
    try {      await orderService.createOrder({
        food_bag_id: selectedFoodBag.id,
        quantity: orderQuantity,
        notes: orderNotes
      })

      addToast({
        title: 'Order Created',
        message: `Your order for ${selectedFoodBag.title} has been placed successfully!`,
        type: 'success'
      })

      // Reset dialog state
      setIsOrderDialogOpen(false)
      setSelectedFoodBag(null)
      setOrderQuantity(1)
      setOrderNotes('')

      // Refresh data
      loadNearbyData()
      loadUserStats()
    } catch (error) {
      console.error('Error creating order:', error)
      addToast({
        title: 'Order Failed',
        message: 'Failed to create order. Please try again.',
        type: 'error'
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const openOrderDialog = (foodBag: FoodBag) => {
    setSelectedFoodBag(foodBag)
    setOrderQuantity(1)
    setOrderNotes('')
    setIsOrderDialogOpen(true)
  }
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // The search will be triggered by the useEffect dependency
  }

  // Fix: Ensure category tab always triggers data load and never sets undefined category
  const handleCategoryTab = (category: string) => {
    setSelectedCategory(category)
    setSearchQuery('')
    // If userLocation is already set, trigger data load immediately
    if (userLocation) {
      loadNearbyDataWithCategory(category)
    }
  }

  // Helper to load data for a specific category (prevents race condition)
  const loadNearbyDataWithCategory = async (category: string) => {
    if (!userLocation) return
    setIsLoading(true)
    try {
      const storeParams = {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        radius: 10,
        category: category === 'All' ? undefined : category,
        query: undefined
      }
      const storesResponse = await storeService.searchStores(storeParams)
      setStores(storesResponse.data)
      const foodBagParams = {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        radius: 10,
        category: category === 'All' ? undefined : category
      }
      const foodBagsResponse = await foodBagService.searchFoodBags(foodBagParams)
      setFoodBags(foodBagsResponse.data)
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to load nearby stores and food bags' })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper to convert string to Title Case
  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

  // Defensive: always treat stores as array
  const safeStores = Array.isArray(stores) ? stores : []

  return (
    <AuthenticatedLayout 
      onSearch={handleSearch}
      searchPlaceholder="Search for food, stores, restaurants..."
    >
      <div className="space-y-6 p-2 sm:p-4 md:p-6">
      {/* Header Section with User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card border-border/30 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{userStats?.total_orders ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/30 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Money Saved</p>
                <p className="text-2xl font-bold">{formatIDR(userStats?.total_savings ?? 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/30 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Heart className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waste Reduced</p>
                <p className="text-2xl font-bold">{userStats?.waste_reduced ?? 0}kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/30 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Gift className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rewards</p>
                <p className="text-2xl font-bold">{userStats?.reward_points ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>      
      {/* Quick Actions */}

      {/* Food Discovery Section */}
      <Card className="glass-card border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5" />
            Food Near You
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Discover discounted food from local businesses and help reduce waste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryTab(category)}
                type="button"
              >
                {toTitleCase(category)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>      
      {/* Available Food Bags */}
      <Card className="glass-card border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="h-5 w-5" />
            Available Food Bags ({foodBags.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading nearby food bags...</div>
          ) : foodBags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No food bags available in your area. Try expanding your search radius or check back later.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodBags.map((foodBag) => (
                <Card key={foodBag.id} className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/30">
                  <CardContent className="p-4">
                    <div className="cursor-pointer" onClick={() => openOrderDialog(foodBag)}>
                      {foodBag.image_url ? (
                        <img
                          src={foodBag.image_url}
                          alt={foodBag.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg hover:underline">{foodBag.title}</h3>
                        <p className="text-sm text-muted-foreground">{foodBag.store.name}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm">{foodBag.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {formatIDR(foodBag.discounted_price)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatIDR(foodBag.original_price)}
                        </span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {foodBag.discount_percent}% off
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {formatDistance(foodBag.store.distance)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(foodBag.pickup_time_start)} - {formatTime(foodBag.pickup_time_end)}
                      </div>
                      <Badge variant="outline">
                        {foodBag.quantity_left} left
                      </Badge>
                    </div>
                    <Button 
                      className="w-full mt-2" 
                      size="sm"
                      onClick={() => openOrderDialog(foodBag)}
                      disabled={foodBag.quantity_left === 0}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {foodBag.quantity_left === 0 ? 'Sold Out' : 'Reserve Now'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>      {/* Nearby Stores */}
      <Card className="glass-card border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5" />
            Nearby Stores ({safeStores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading nearby stores...</div>
          ) : safeStores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stores found in your area. Try expanding your search or changing filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeStores.map((store) => (
                <Card key={store.id} className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/30">
                  <CardContent className="p-4">
                    <div className="cursor-pointer flex items-start gap-4" onClick={() => navigate(`/stores/${store.id}`)}>
                      {store.image_url ? (
                        <img
                          src={store.image_url}
                          alt={store.name}
                          className="w-20 h-20 object-cover rounded-lg mb-3"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-muted rounded-lg mb-3 flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg hover:underline">{store.name}</h3>
                        <p className="text-sm text-muted-foreground">{store.category}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm">{store.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{store.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{store.address}</span>
                      <span>• {formatDistance(store.distance)}</span>
                    </div>
                    {/* Show food bags for this store with images */}
                    {Array.isArray(foodBags) && foodBags.filter(bag => bag.store.id === store.id).length > 0 && (
                      <div className="mt-2">
                        <h4 className="font-medium text-sm text-foreground mb-1">Available Food Bags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {foodBags.filter(bag => bag.store.id === store.id).map(bag => (
                            <div key={bag.id} className="w-28">
                              {bag.image_url ? (
                                <img src={bag.image_url} alt={bag.title} className="w-28 h-20 object-cover rounded mb-1" />
                              ) : (
                                <div className="w-28 h-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground mb-1">No Image</div>
                              )}
                              <div className="text-xs font-semibold line-clamp-1">{bag.title}</div>
                              <div className="text-xs text-muted-foreground">${bag.discounted_price.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-3" size="sm" onClick={() => navigate(`/stores/${store.id}`)}>
                      View Store
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[425px] glass-card border-border/30 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Reserve Food Bag</DialogTitle>
            <DialogDescription>
              {selectedFoodBag && (
                <>Complete your order for {selectedFoodBag.title} from {selectedFoodBag.store.name}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFoodBag && (
            <div className="space-y-4">              {/* Order Summary */}
              <div className="glass-card border border-border/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{selectedFoodBag.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedFoodBag.store.name}</p>
                  </div>
                </div>
                  <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${selectedFoodBag.discounted_price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${selectedFoodBag.original_price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(selectedFoodBag.pickup_time_start)} - {formatTime(selectedFoodBag.pickup_time_end)}
                  </div>
                  <Badge variant="outline">
                    {selectedFoodBag.quantity_left} available
                  </Badge>
                </div>
              </div>              {/* Quantity Selection */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    disabled={orderQuantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, Math.min(selectedFoodBag.quantity_left, parseInt(e.target.value) || 1)))}
                    className="w-20 text-center"
                    min={1}
                    max={selectedFoodBag.quantity_left}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOrderQuantity(Math.min(selectedFoodBag.quantity_left, orderQuantity + 1))}
                    disabled={orderQuantity >= selectedFoodBag.quantity_left}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total: ${(selectedFoodBag.discounted_price * orderQuantity).toFixed(2)}
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or dietary requirements..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOrderDialogOpen(false)}
              disabled={isCreatingOrder}
            >
              Cancel
            </Button>            <Button 
              onClick={handleOrderFood}
              disabled={isCreatingOrder || !selectedFoodBag}
            >
              {isCreatingOrder ? 'Placing Order...' : `Reserve ${orderQuantity} Item${orderQuantity > 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>        </DialogContent>
      </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}
