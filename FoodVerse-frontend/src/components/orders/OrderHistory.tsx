import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/shared/ToastProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Clock, MapPin, ShoppingBag, Eye, Star, CalendarDays } from 'lucide-react'
import { orderService, type Order } from '@/services/orderService'

export function OrderHistory() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterAndSortOrders()
  }, [orders, searchQuery, statusFilter, sortBy])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const response = await orderService.getMyOrders()
      setOrders(response.data)
    } catch (error) {
      console.error('Error loading orders:', error)
      addToast({
        type: 'error',
        message: 'Failed to load order history'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortOrders = () => {
    let filtered = orders

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.food_bag?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.store?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Sort orders
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      
      switch (sortBy) {
        case 'newest':
          return dateB - dateA
        case 'oldest':
          return dateA - dateB
        case 'price-high':
          return b.total_price - a.total_price
        case 'price-low':
          return a.total_price - b.total_price
        default:
          return dateB - dateA
      }
    })

    setFilteredOrders(filtered)
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateSavings = (order: Order) => {
    if (!order.food_bag) return 0
    const originalTotal = order.food_bag.original_price * order.quantity
    return originalTotal - order.total_price
  }

  const getOrderSummary = () => {
    const totalOrders = orders.length
    const completedOrders = orders.filter(order => order.status === 'completed').length
    const totalSpent = orders.reduce((sum, order) => sum + order.total_price, 0)
    const totalSavings = orders.reduce((sum, order) => sum + calculateSavings(order), 0)

    return { totalOrders, completedOrders, totalSpent, totalSavings }
  }

  const summary = getOrderSummary()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Order History</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{summary.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{summary.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${summary.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-2xl font-bold">${summary.totalSavings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by food item or store name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Orders ({filteredOrders.length})</CardTitle>
              <CardDescription>
                Track your food rescue orders and pickup history
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {orders.length === 0 
                  ? "You haven't placed any orders yet. Start saving food today!"
                  : "No orders match your current filters."
                }
              </p>
              {orders.length === 0 && (
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/dashboard')}
                >
                  Browse Food Bags
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="glass-card hover:shadow-lg transition-all duration-300 border-border/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{order.food_bag?.title || 'Food Bag'}</h3>
                          <p className="text-sm text-muted-foreground">{order.store?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        {order.pickup_code && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Pickup: {order.pickup_code}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="font-medium">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{order.quantity} item{order.quantity > 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="font-medium text-primary">${order.total_price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Savings</p>
                        <p className="font-medium text-green-600">${calculateSavings(order).toFixed(2)}</p>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm bg-muted/50 p-2 rounded">{order.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{order.store?.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Order #{order.id}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
