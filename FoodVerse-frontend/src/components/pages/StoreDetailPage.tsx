import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Star, ShoppingBag, Filter, Heart, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { storeService, type Store } from '@/services/storeService'
import { foodBagService, type FoodBag } from '@/services/foodBagService'
import { orderService } from '@/services/orderService'
import { useToast } from '@/components/shared/ToastProvider'
import { useAuth } from '@/contexts/AuthContext'

export function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  
  const [store, setStore] = useState<Store | null>(null)
  const [foodBags, setFoodBags] = useState<FoodBag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isOrdering, setIsOrdering] = useState<number | null>(null)

  const categories = ['all', 'bakery', 'restaurant', 'grocery', 'cafe']

  useEffect(() => {
    if (storeId) {
      loadStoreData()
    }
  }, [storeId])
  const loadStoreData = async () => {
    try {
      setIsLoading(true)
      const [storeData, foodBagsData] = await Promise.all([
        storeService.getStore(parseInt(storeId!)),
        foodBagService.getFoodBagsByStore(parseInt(storeId!))
      ])
      setStore(storeData.data)
      setFoodBags(foodBagsData.data)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load store information'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrder = async (foodBagId: number) => {
    if (!user) {
      addToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please log in to place an order'
      })
      return
    }

    setIsOrdering(foodBagId)
    try {
      await orderService.createOrder({
        food_bag_id: foodBagId,
        quantity: 1
      })
      addToast({
        type: 'success',
        title: 'Order Placed',
        message: 'Your order has been placed successfully!'
      })
      // Refresh food bags to update quantities
      loadStoreData()
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Order Failed',
        message: error.message || 'Failed to place order'
      })
    } finally {
      setIsOrdering(null)
    }
  }

  const filteredFoodBags = foodBags.filter(bag => 
    selectedCategory === 'all' || bag.category === selectedCategory
  )

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="text-center glass-card p-8 rounded-lg shadow-2xl border border-border/30">
          <h2 className="text-2xl font-bold text-foreground mb-4">Store Not Found</h2>
          <p className="text-muted-foreground mb-4">The store you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/stores')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stores
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/stores')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Stores
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Store Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card border-border/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold text-foreground mb-2">
                    {store.name}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground mb-4">
                    {store.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {store.address}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.5 (120 reviews)
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {store.category}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Filter and Food Bags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Available Food Bags</h2>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredFoodBags.length === 0 ? (
            <Card className="glass-card border-border/30">
              <CardContent className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Food Bags Available
                </h3>
                <p className="text-muted-foreground">
                  {selectedCategory === 'all' 
                    ? 'This store currently has no food bags available.'
                    : `No food bags available in the ${selectedCategory} category.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoodBags.map((foodBag, index) => (
                <motion.div
                  key={foodBag.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="glass-card border-border/30 hover:border-primary/50 transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {foodBag.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground mt-1">
                            {foodBag.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs ml-2">
                          {foodBag.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(foodBag.discounted_price)}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(foodBag.original_price)}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {foodBag.discount_percent}% OFF
                            </Badge>
                          </div>
                        </div>

                        {/* Availability and Pickup Time */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Available:</span>
                            <span className="font-medium text-foreground">
                              {foodBag.quantity_left} left
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Pickup: {formatTime(foodBag.pickup_time_start)} - {formatTime(foodBag.pickup_time_end)}
                            </span>
                          </div>
                        </div>

                        {/* Order Button */}
                        <Button
                          className="w-full"
                          onClick={() => handleOrder(foodBag.id)}
                          disabled={foodBag.quantity_left === 0 || isOrdering === foodBag.id}
                        >
                          {isOrdering === foodBag.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Ordering...
                            </>
                          ) : foodBag.quantity_left === 0 ? (
                            'Sold Out'
                          ) : (
                            <>
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Order Now
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
