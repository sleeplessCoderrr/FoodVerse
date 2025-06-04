import { useState, useEffect } from 'react'
import { useToast } from '@/components/ToastProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, Star, Search, ShoppingBag, Plus, Minus } from 'lucide-react'
import { storeService, type Store } from '@/services/storeService'
import { foodBagService, type FoodBag } from '@/services/foodBagService'
import { orderService } from '@/services/orderService'

export function ConsumerDashboard() {
  const [stores, setStores] = useState<Store[]>([])
  const [foodBags, setFoodBags] = useState<FoodBag[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  
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
  }, [])

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
    try {
      await orderService.createOrder({
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

      // Refresh food bags to update quantities
      loadNearbyData()
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 space-y-6 p-6">
      {/* Search and Filter Section */}
      <Card className="glass-card border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5" />
            Find Food Near You
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Discover discounted food from local businesses and help reduce waste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search for stores or food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={loadNearbyData} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>      {/* Available Food Bags */}
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
          ) : (            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodBags.map((foodBag) => (
                <Card key={foodBag.id} className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/30">
                  <CardContent className="p-4">
                    {foodBag.image_url && (
                      <img
                        src={foodBag.image_url}
                        alt={foodBag.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{foodBag.title}</h3>
                        <p className="text-sm text-muted-foreground">{foodBag.store.name}</p>
                      </div>
                      
                      <p className="text-sm">{foodBag.description}</p>
                      
                      <div className="flex items-center justify-between">                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            ${foodBag.discounted_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${foodBag.original_price.toFixed(2)}
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
                      </div>                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => openOrderDialog(foodBag)}
                        disabled={foodBag.quantity_left === 0}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {foodBag.quantity_left === 0 ? 'Sold Out' : 'Reserve Now'}
                      </Button>
                    </div>
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
            Nearby Stores ({stores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading nearby stores...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stores found in your area. Try expanding your search or changing filters.
            </div>
          ) : (            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stores.map((store) => (
                <Card key={store.id} className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <p className="text-sm text-muted-foreground">{store.category}</p>
                      </div>                      <div className="flex items-center gap-1">
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

                    <Button variant="outline" className="w-full" size="sm">
                      View Store
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>          )}
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
              </div>

              {/* Quantity Selection */}
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
            </Button>
            <Button 
              onClick={handleOrderFood}
              disabled={isCreatingOrder || !selectedFoodBag}
            >
              {isCreatingOrder ? 'Placing Order...' : `Reserve ${orderQuantity} Item${orderQuantity > 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
