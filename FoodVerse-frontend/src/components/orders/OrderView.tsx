import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/shared/ToastProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Clock, Phone, Mail, ShoppingBag, Star, CalendarDays, Copy, Navigation } from 'lucide-react'
import { orderService, type Order } from '@/services/orderService'
import { Separator } from '../ui/separator'
import { formatIDR } from '@/lib/utils'

export function OrderView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadOrder(parseInt(id))
    }
  }, [id])

  const loadOrder = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await orderService.getOrder(id)
      setOrder(response.data)
    } catch (error) {
      console.error('Error loading order:', error)
      addToast({
        type: 'error',
        message: 'Failed to load order details'
      })
      navigate('/orders')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ready': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateSavings = () => {
    if (!order?.food_bag) return 0
    const originalTotal = order.food_bag.original_price * order.quantity
    return originalTotal - order.total_price
  }

  const copyPickupCode = () => {
    if (order?.pickup_code) {
      navigator.clipboard.writeText(order.pickup_code)
      addToast({
        type: 'success',
        message: 'Pickup code copied to clipboard!'
      })
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order is being processed by the store.'
      case 'confirmed':
        return 'Your order has been confirmed! The store is preparing your food bag.'
      case 'ready':
        return 'Your food bag is ready for pickup! Please visit the store with your pickup code.'
      case 'completed':
        return 'Order completed successfully. Thank you for helping reduce food waste!'
      case 'cancelled':
        return 'This order has been cancelled.'
      default:
        return 'Order status unknown.'
    }
  }

  const openInMaps = () => {
    if (!order?.store?.address) return
    const address = encodeURIComponent(order.store.address)
    const url = `https://maps.google.com/?q=${address}`
    window.open(url, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order #{order.id}</h1>
          <p className="text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status */}
        <Card className="lg:col-span-3 glass-card border-border/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Order Status
                </CardTitle>
                <CardDescription>{getStatusMessage(order.status)}</CardDescription>
              </div>
              <Badge variant="secondary" className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          {order.pickup_code && (
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary mb-1">Pickup Code</p>
                    <p className="text-2xl font-mono font-bold">{order.pickup_code}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Show this code to the store staff when picking up your order
                    </p>
                  </div>
                  <Button variant="outline" onClick={copyPickupCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Food Bag Details */}
        <Card className="lg:col-span-2 glass-card border-border/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Food Bag Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.food_bag && (
              <>
                {order.food_bag.image_url && (
                  <img
                    src={order.food_bag.image_url}
                    alt={order.food_bag.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{order.food_bag.title}</h3>
                  <p className="text-muted-foreground mb-4">{order.food_bag.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Original Price</p>
                      <p className="text-lg line-through">{formatIDR(order.food_bag.original_price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Discounted Price</p>
                      <p className="text-lg font-semibold text-primary">{formatIDR(order.food_bag.discounted_price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity Ordered</p>
                      <p className="text-lg font-semibold">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Discount</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {order.food_bag.discount_percent}% off
                      </Badge>
                    </div>
                  </div>

                  {order.food_bag.pickup_time_start && order.food_bag.pickup_time_end && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Pickup time: {formatTime(order.food_bag.pickup_time_start)} - {formatTime(order.food_bag.pickup_time_end)}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {order.notes && (
              <div>
                <p className="font-medium mb-2">Special Instructions</p>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm">{order.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card className="glass-card border-border/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.store && (
              <>
                <div>
                  <h3 className="text-lg font-semibold">{order.store.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{order.store.category}</p>
                  {order.store.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{order.store.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <p className="font-medium mb-2">Address</p>
                  <p className="text-sm text-muted-foreground mb-3">{order.store.address}</p>
                  <Button variant="outline" size="sm" onClick={openInMaps} className="w-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Open in Maps
                  </Button>
                </div>

                {order.store.phone && (
                  <div>
                    <p className="font-medium mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${order.store.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {order.store.phone}
                      </a>
                    </div>
                  </div>
                )}

                {order.store.email && (
                  <div>
                    <p className="font-medium mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${order.store.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {order.store.email}
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="lg:col-span-3 glass-card border-border/30 shadow-xl">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({order.quantity} item{order.quantity > 1 ? 's' : ''})</span>
                <span>{formatIDR(order.total_price)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>You saved</span>
                <span>-{formatIDR(calculateSavings())}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatIDR(order.total_price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
