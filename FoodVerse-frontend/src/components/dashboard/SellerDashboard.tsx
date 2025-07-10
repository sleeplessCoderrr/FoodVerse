import React, { useState, useEffect } from 'react'
import { useToast } from '@/components/shared/ToastProvider'
import { AuthenticatedLayout } from '@/components/shared/AuthenticatedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '../ui/switch'
import { Progress } from '../ui/progress'
import { ConfirmationModal } from '../ui/confirmation-modal'
import { 
  Store, MapPin, Plus, Edit, Trash2, ShoppingBag, Clock, Package, 
  Power, PowerOff, TrendingUp, Users, DollarSign,
  BarChart3, Eye, CheckCircle, AlertCircle, XCircle,
  Download, Image, Save, RefreshCw
} from 'lucide-react'
import { storeService, type Store as StoreType, type StoreInput } from '@/services/storeService'
import { foodBagService, type FoodBag, type FoodBagInput } from '@/services/foodBagService'
import { orderService, type Order } from '@/services/orderService'
import { formatIDR } from '@/lib/utils'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  completionRate: number
  avgOrderValue: number
  topSellingItems: { name: string; sales: number }[]
  revenueByDay: { day: string; revenue: number }[]
  ordersByStatus: { status: string; count: number }[]
}

interface StoreCustomization {
  theme: 'light' | 'dark' | 'colorful'
  primaryColor: string
  layout: 'grid' | 'list' | 'carousel'
  showRating: boolean
  showReviews: boolean
  autoApproveOrders: boolean
  notificationsEnabled: boolean
  businessHours: {
    [key: string]: { open: string; close: string; isOpen: boolean }
  }
}

export function SellerDashboard() {
  // Inject styles
  React.useEffect(() => {
    const layoutStyles = `
      [data-inventory-container].grid-layout {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
        gap: 1.5rem !important;
      }
      [data-inventory-container].list-layout {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
      }
      [data-inventory-container].list-layout > * {
        flex: 1 !important;
        max-width: 100% !important;
      }
      [data-inventory-container].carousel-layout {
        display: flex !important;
        overflow-x: auto !important;
        gap: 1rem !important;
        scroll-snap-type: x mandatory !important;
      }
      [data-inventory-container].carousel-layout > * {
        flex: 0 0 300px !important;
        scroll-snap-align: start !important;
      }
      
      /* Hide elements based on display settings */
      [data-show-rating="false"] .store-rating {
        display: none !important;
      }
      [data-show-reviews="false"] .customer-reviews {
        display: none !important;
      }
    `
    
    const styleElement = document.createElement('style')
    styleElement.textContent = layoutStyles
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])
  // State management
  const [store, setStore] = useState<StoreType | null>(null)
  const [foodBags, setFoodBags] = useState<FoodBag[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [customization, setCustomization] = useState<StoreCustomization>({
    theme: 'light',
    primaryColor: '#3b82f6',
    layout: 'grid',
    showRating: true,
    showReviews: true,
    autoApproveOrders: false,
    notificationsEnabled: true,
    businessHours: {
      monday: { open: '09:00', close: '17:00', isOpen: true },
      tuesday: { open: '09:00', close: '17:00', isOpen: true },
      wednesday: { open: '09:00', close: '17:00', isOpen: true },
      thursday: { open: '09:00', close: '17:00', isOpen: true },
      friday: { open: '09:00', close: '17:00', isOpen: true },
      saturday: { open: '10:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: false }
    }
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showStoreDialog, setShowStoreDialog] = useState(false)
  const [showFoodBagDialog, setShowFoodBagDialog] = useState(false)
  const [showCustomizationDialog, setShowCustomizationDialog] = useState(false)
  const [editingStore, setEditingStore] = useState<StoreType | null>(null)
  const [editingFoodBag, setEditingFoodBag] = useState<FoodBag | null>(null)
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    variant?: 'default' | 'destructive' | 'warning' | 'info'
    confirmText?: string
    isLoading?: boolean
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'default',
    confirmText: 'Confirm',
    isLoading: false
  })
  
  const { addToast } = useToast()
    // Helper function to get store ID (handles both 'id' and 'ID' properties from backend)
  const getStoreId = (storeData: StoreType | null | undefined): number | undefined => {
    if (!storeData) return undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (storeData as any)['ID'] || (storeData as any)['id']
  }

  // Helper function to get food bag ID (handles both 'id' and 'ID' properties from backend)
  const getFoodBagId = (foodBagData: FoodBag | null | undefined): number | undefined => {
    if (!foodBagData) return undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (foodBagData as any)['ID'] || (foodBagData as any)['id']
  }
  
  const categories = ['bakery', 'restaurant', 'grocery', 'cafe']
  const themes = [
    { value: 'light', label: 'Light', preview: '#ffffff' },    { value: 'dark', label: 'Dark', preview: '#1f2937' },
    { value: 'colorful', label: 'Colorful', preview: '#8b5cf6' }  ]
  
  // Load data on component mount
  useEffect(() => {
    loadInitialData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Helper function to show confirmation modal
  const showConfirmation = (config: {
    title: string
    description: string
    onConfirm: () => Promise<void> | void
    variant?: 'default' | 'destructive' | 'warning' | 'info'
    confirmText?: string
  }) => {
    setConfirmationModal({
      isOpen: true,
      title: config.title,
      description: config.description,
      variant: config.variant || 'default',
      confirmText: config.confirmText || 'Confirm',
      isLoading: false,
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        try {
          await config.onConfirm()
          setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }))
        } catch (error) {
          console.error('Confirmation action failed:', error)
          setConfirmationModal(prev => ({ ...prev, isLoading: false }))
        }
      }
    })
  }
  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      await loadStore()
    } catch (error) {
      console.error('Error loading initial data:', error)
      addToast({
        type: 'error',
        message: 'Failed to load dashboard data. Please refresh the page.'
      })
    } finally {
      setIsLoading(false)
    }  }

  const loadStore = async () => {
    try {
      const response = await storeService.getOwnedStores()
      if (response.data.length > 0) {
        const storeData = response.data[0]
        setStore(storeData)
        const storeId = getStoreId(storeData)
        if (storeId) {
          await loadFoodBags(storeId)
          await loadOrders(storeId)
        }
      } else {
        setStore(null)
        setFoodBags([])
        setOrders([])
      }
    } catch (error) {
      console.error('Error loading store:', error)
      addToast({
        type: 'error',
        message: 'Failed to load your store. Please refresh the page.'
      })
    }
  }
  
  const loadFoodBags = async (storeId: number) => {
    if (!storeId) {
      console.error('loadFoodBags called with undefined/null storeId')
      return
    }
    try {
      const response = await foodBagService.getFoodBagsByStore(storeId)
      setFoodBags(response.data)
    } catch (error) {
      console.error('Error loading food bags:', error)
    }
  }
  
  const loadOrders = async (storeId?: number) => {
    const currentStoreId = storeId || getStoreId(store)
    if (!currentStoreId) return
    
    try {
      const response = await orderService.getStoreOrders(currentStoreId)
      setOrders(response.data)
      calculateStats(response.data)
    } catch (error) {
      console.error('Error loading orders:', error)
      addToast({
        type: 'error',
        message: 'Failed to load orders. Please try again.'
      })
    }
  }

  const calculateStats = (orderData: Order[]) => {
    const totalRevenue = orderData
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.total_price, 0)
    
    const totalOrders = orderData.length
    const completedOrders = orderData.filter(order => order.status === 'completed').length
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0
    
    // Get unique customers
    const uniqueCustomers = new Set(orderData.map(order => order.user_id)).size
    
    // Calculate top selling items
    const itemSales: { [key: string]: number } = {}
    orderData.forEach(order => {
      if (order.food_bag) {
        const itemName = order.food_bag.title
        itemSales[itemName] = (itemSales[itemName] || 0) + order.quantity
      }
    })
    
    const topSellingItems = Object.entries(itemSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
    
    // Calculate orders by status
    const statusCounts: { [key: string]: number } = {}
    orderData.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })
    
    const ordersByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }))
    
    // Mock revenue by day (in real app, this would come from backend)
    const revenueByDay = [
      { day: 'Mon', revenue: totalRevenue * 0.1 },
      { day: 'Tue', revenue: totalRevenue * 0.15 },
      { day: 'Wed', revenue: totalRevenue * 0.12 },
      { day: 'Thu', revenue: totalRevenue * 0.18 },
      { day: 'Fri', revenue: totalRevenue * 0.25 },
      { day: 'Sat', revenue: totalRevenue * 0.15 },
      { day: 'Sun', revenue: totalRevenue * 0.05 }
    ]
    
    setStats({
      totalRevenue,
      totalOrders,
      totalCustomers: uniqueCustomers,
      completionRate,
      avgOrderValue,
      topSellingItems,
      revenueByDay,
      ordersByStatus
    })
  }

  // Event handlers
  const handleStoreSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const storeData: StoreInput = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      latitude: parseFloat(formData.get('latitude') as string),
      longitude: parseFloat(formData.get('longitude') as string),
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      category: formData.get('category') as string,
      image_url: formData.get('image_url') as string
    }

    try {
      if (editingStore) {
        await storeService.updateStore(getStoreId(editingStore)!, storeData)
        addToast({
          type: 'success',
          message: 'Store updated successfully'
        })
      } else {
        await storeService.createStore(storeData)
        addToast({
          type: 'success',
          message: 'Store created successfully'
        })
      }
      
      setShowStoreDialog(false)
      setEditingStore(null)
      await loadStore()
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const apiError = error as { response?: { status?: number; data?: { error?: string } } }
        if (apiError.response?.status === 400 && apiError.response?.data?.error?.includes('only have one store')) {
          addToast({
            type: 'error',
            title: 'Store Limit Reached',
            message: 'You can only have one store. Please update your existing store instead.'
          })
        } else {
          addToast({
            type: 'error',
            message: `Failed to ${editingStore ? 'update' : 'create'} store`
          })
        }
      } else {
        addToast({
          type: 'error',
          message: `Failed to ${editingStore ? 'update' : 'create'} store`
        })
      }
    }
  }

  const handleFoodBagSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!store) return
    
    const formData = new FormData(event.currentTarget)
    
    const foodBagData: FoodBagInput = {
      store_id: getStoreId(store)!,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      original_price: parseFloat(formData.get('original_price') as string),
      discounted_price: parseFloat(formData.get('discounted_price') as string),
      quantity_total: parseInt(formData.get('quantity_total') as string),
      pickup_time_start: new Date(formData.get('pickup_time_start') as string).toISOString(),
      pickup_time_end: new Date(formData.get('pickup_time_end') as string).toISOString(),
      image_url: formData.get('image_url') as string,
      category: formData.get('category') as string    }

    try {
      if (editingFoodBag) {
        const foodBagId = getFoodBagId(editingFoodBag)
        if (!foodBagId) {
          throw new Error('Food bag ID not found')
        }
        await foodBagService.updateFoodBag(foodBagId, foodBagData)
        addToast({
          type: 'success',
          message: 'Food bag updated successfully'
        })
      } else {
        await foodBagService.createFoodBag(foodBagData)
        addToast({
          type: 'success',
          message: 'Food bag created successfully'
        })      }
      
      setShowFoodBagDialog(false)
      setEditingFoodBag(null)
      if (store) {
        await loadFoodBags(getStoreId(store)!)
      }
    } catch (error) {      console.error('Food bag creation/update error:', error)
      addToast({
        type: 'error',
        message: `Failed to ${editingFoodBag ? 'update' : 'create'} food bag`
      })
    }
  }
  
  const handleCustomizationSave = () => {
    // Apply theme changes immediately
    applyThemeChanges(customization)
    
    // Save to localStorage and backend
    localStorage.setItem('storeCustomization', JSON.stringify(customization))
    
    // In a real app, this would save to backend
    if (store) {
      // TODO: Implement backend API call to save store customization
      // await storeService.updateCustomization(getStoreId(store)!, customization)
    }
    
    addToast({
      type: 'success',
      message: 'Store customization saved successfully'
    })
    setShowCustomizationDialog(false)
  }
  // Apply theme changes to the document
  const applyThemeChanges = (settings: StoreCustomization) => {
    const root = document.documentElement
    
    // Apply theme
    if (settings.theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light', 'colorful')
    } else if (settings.theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark', 'colorful')
    } else if (settings.theme === 'colorful') {
      root.classList.add('colorful')
      root.classList.remove('dark', 'light')
    }
    
    // Apply primary color
    root.style.setProperty('--primary', settings.primaryColor)
    root.style.setProperty('--primary-foreground', getContrastColor(settings.primaryColor))
    
    // Apply layout preferences to local storage for other components to use
    localStorage.setItem('layoutStyle', settings.layout)
    localStorage.setItem('showRating', settings.showRating.toString())
    localStorage.setItem('showReviews', settings.showReviews.toString())
    localStorage.setItem('autoApproveOrders', settings.autoApproveOrders.toString())
    localStorage.setItem('notificationsEnabled', settings.notificationsEnabled.toString())
    
    // Apply visual changes immediately
    applyLayoutChanges(settings)
    applyDisplayChanges(settings)
    applyNotificationChanges(settings)
  }

  // Apply layout changes to the UI
  const applyLayoutChanges = (settings: StoreCustomization) => {
    const inventory = document.querySelector('[data-inventory-container]')
    if (inventory) {
      inventory.classList.remove('grid-layout', 'list-layout', 'carousel-layout')
      inventory.classList.add(`${settings.layout}-layout`)
    }
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('layoutChanged', { detail: settings.layout }))
  }

  // Apply display option changes
  const applyDisplayChanges = (settings: StoreCustomization) => {
    // Update data attributes on the root element for CSS targeting
    const root = document.documentElement
    root.setAttribute('data-show-rating', settings.showRating.toString())
    root.setAttribute('data-show-reviews', settings.showReviews.toString())
    root.setAttribute('data-auto-approve', settings.autoApproveOrders.toString())
    
    // Trigger custom events for specific features
    window.dispatchEvent(new CustomEvent('displayOptionsChanged', { 
      detail: { 
        showRating: settings.showRating, 
        showReviews: settings.showReviews,
        autoApprove: settings.autoApproveOrders 
      } 
    }))
  }

  // Apply notification settings
  const applyNotificationChanges = (settings: StoreCustomization) => {
    if (settings.notificationsEnabled) {
      // Request notification permission if not already granted
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            addToast({
              type: 'success',
              message: 'Notifications enabled successfully'
            })
          }
        })
      }
    }
    
    // Store notification preference
    localStorage.setItem('notificationsEnabled', settings.notificationsEnabled.toString())
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('notificationSettingsChanged', { 
      detail: { enabled: settings.notificationsEnabled } 
    }))
  }

  // Helper function to get contrasting color for text
  const getContrastColor = (hexcolor: string) => {
    // Remove # if present
    hexcolor = hexcolor.replace('#', '')
    
    // Convert to RGB
    const r = parseInt(hexcolor.substr(0,2), 16)
    const g = parseInt(hexcolor.substr(2,2), 16)
    const b = parseInt(hexcolor.substr(4,2), 16)
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }
  // Load customization settings on component mount
  useEffect(() => {
    const savedCustomization = localStorage.getItem('storeCustomization')
    if (savedCustomization) {
      try {
        const parsed = JSON.parse(savedCustomization)
        setCustomization(parsed)
        applyThemeChanges(parsed)
      } catch (error) {
        console.error('Error parsing saved customization:', error)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle export settings
  const handleExportSettings = () => {
    const dataStr = JSON.stringify(customization, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${store?.name || 'store'}-settings.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    addToast({
      type: 'success',
      message: 'Settings exported successfully'
    })
  }

  // Handle import settings
  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string
        const importedSettings = JSON.parse(result)
        
        // Validate the imported settings
        if (importedSettings && typeof importedSettings === 'object') {
          setCustomization(prev => ({ ...prev, ...importedSettings }))
          applyThemeChanges({ ...customization, ...importedSettings })
          
          addToast({
            type: 'success',
            message: 'Settings imported successfully'
          })
        } else {
          throw new Error('Invalid settings file format')
        }
      } catch (error) {
        console.error('Error importing settings:', error)
        addToast({
          type: 'error',
          message: 'Failed to import settings. Please check the file format.'
        })
      }
    }
    reader.readAsText(file)
    
    // Clear the input value so the same file can be selected again
    event.target.value = ''
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'confirmed': return 'bg-blue-500'
      case 'ready': return 'bg-purple-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'ready': return <Package className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-muted-foreground">
              {store ? `Managing ${store.name}` : 'Create your store to get started'}
            </p>
          </div>          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                setIsLoading(true)
                try {
                  await loadInitialData()
                  addToast({
                    type: 'success',
                    message: 'Dashboard data refreshed successfully'
                  })
                } catch (error) {
                  console.error('Error refreshing data:', error)
                  addToast({
                    type: 'error',
                    message: 'Failed to refresh data'
                  })
                }
              }}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>            <Button 
              onClick={() => {
                setEditingStore(store)
                setShowStoreDialog(true)
              }}
            >
              {store ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Store
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Store
                </>
              )}
            </Button>
          </div>
        </div>

        {!store ? (
          // No store created yet
          <Card className="glass-card border-border/30 shadow-xl">
            <CardContent className="text-center py-16">
              <Store className="h-24 w-24 mx-auto text-muted-foreground/50 mb-6" />
              <h2 className="text-2xl font-bold mb-4">Welcome to FoodVerse Seller Dashboard</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your store to start selling surplus food bags and help reduce food waste in your community.
              </p>
              <Button size="lg" onClick={() => setShowStoreDialog(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Create Your Store
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Main dashboard with tabs
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">            
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="store">Store</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="glass-card border-border/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                          <p className="text-2xl font-bold">{formatIDR(stats.totalRevenue)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-border/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                          <p className="text-2xl font-bold">{stats.totalOrders}</p>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-border/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Customers</p>
                          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-border/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                          <p className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-500" />
                      </div>
                      <Progress value={stats.completionRate} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Quick Actions */}
              <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your store efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2"
                      onClick={() => setShowFoodBagDialog(true)}
                    >
                      <Plus className="h-6 w-6" />
                      Add Food Bag
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2"
                      onClick={() => setActiveTab('orders')}
                    >
                      <Eye className="h-6 w-6" />
                      View Orders
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <BarChart3 className="h-6 w-6" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders yet. Start creating food bags to receive orders!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <p className="font-medium">
                                {order.food_bag?.title || 'Unknown Item'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {order.quantity} • {formatIDR(order.total_price)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <Card className="glass-card border-border/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Food Bag Inventory</CardTitle>
                    <CardDescription>Manage your food offerings</CardDescription>
                  </div>
                  <Button onClick={() => setShowFoodBagDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Food Bag
                  </Button>
                </CardHeader>
                <CardContent>
                  {foodBags.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Food Bags</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first food bag to start selling surplus food and reduce waste.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-inventory-container>
                      {foodBags.map((foodBag) => (
                        <Card key={getFoodBagId(foodBag)} className="border hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            {foodBag.image_url && (
                              <div className="relative mb-4">
                                <img
                                  src={foodBag.image_url}
                                  alt={foodBag.title}
                                  className="w-full h-40 object-cover rounded-lg"
                                />
                                <Badge 
                                  className="absolute top-2 right-2" 
                                  variant={foodBag.quantity_left > 0 ? "default" : "secondary"}
                                >
                                  {foodBag.quantity_left} left
                                </Badge>
                              </div>
                            )}
                            
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg">{foodBag.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {foodBag.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-lg font-bold text-primary">
                                    {formatIDR(foodBag.discounted_price)}
                                  </p>
                                  <p className="text-sm text-muted-foreground line-through">
                                    {formatIDR(foodBag.original_price)}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  {foodBag.category}
                                </Badge>
                              </div>

                              <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-1 mb-1">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {new Date(foodBag.pickup_time_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                    {new Date(foodBag.pickup_time_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => {
                                    setEditingFoodBag(foodBag)
                                    setShowFoodBagDialog(true)
                                  }}                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    showConfirmation({
                                      title: 'Delete Food Bag',
                                      description: `Are you sure you want to delete "${foodBag.title}"? This action cannot be undone.`,
                                      variant: 'destructive',
                                      confirmText: 'Delete',                                      onConfirm: async () => {
                                        const foodBagId = getFoodBagId(foodBag)
                                        if (!foodBagId) {
                                          addToast({
                                            type: 'error',
                                            message: 'Food bag ID not found'
                                          })
                                          return
                                        }
                                        await foodBagService.deleteFoodBag(foodBagId)
                                        addToast({
                                          type: 'success',
                                          message: 'Food bag deleted successfully'
                                        })
                                        if (store) {
                                          await loadFoodBags(getStoreId(store)!)
                                        }
                                      }
                                    })
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Weekly revenue overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">Revenue chart would go here</p>
                        <p className="text-sm text-muted-foreground">Integration with chart library needed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Selling Items */}
                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle>Top Selling Items</CardTitle>
                    <CardDescription>Best performing food bags</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.topSellingItems.length ? (
                      <div className="space-y-4">
                        {stats.topSellingItems.map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span className="text-muted-foreground">{item.sales} sold</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No sales data available yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Status Distribution */}
              <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                  <CardDescription>Overview of order statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.ordersByStatus.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {stats.ordersByStatus.map((item) => (
                        <div key={item.status} className="text-center p-4 rounded-lg border">
                          <div className={`w-12 h-12 rounded-full ${getStatusColor(item.status)} mx-auto mb-2 flex items-center justify-center`}>
                            {getStatusIcon(item.status)}
                          </div>
                          <p className="font-bold text-2xl">{item.count}</p>
                          <p className="text-sm text-muted-foreground capitalize">{item.status}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No order data available yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Store Tab */}
            <TabsContent value="store" className="space-y-6">              <Card className="glass-card border-border/30">
                <CardHeader>
                  <div>
                    <CardTitle>Store Information</CardTitle>
                    <CardDescription>Your store details and settings</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Store Name</Label>
                      <p className="text-lg font-semibold">{store.name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      <p className="text-sm">{store.description || 'No description provided'}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <Badge variant="outline" className="mt-1">
                        {store.category.charAt(0).toUpperCase() + store.category.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                      <p className="text-sm flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {store.address}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                        <p className="text-sm">{store.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="text-sm">{store.email || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={store.is_active ? "default" : "secondary"}>
                          {store.is_active ? "Active" : "Inactive"}
                        </Badge>                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const action = store.is_active ? 'deactivate' : 'activate'
                            showConfirmation({
                              title: `${action.charAt(0).toUpperCase() + action.slice(1)} Store`,
                              description: `Are you sure you want to ${action} your store? ${
                                store.is_active 
                                  ? 'Your store will be hidden from customers and no new orders can be placed.' 
                                  : 'Your store will become visible to customers and they can place orders.'
                              }`,
                              variant: store.is_active ? 'warning' : 'default',
                              confirmText: `${action.charAt(0).toUpperCase() + action.slice(1)} Store`,
                              onConfirm: async () => {
                                await storeService.toggleStoreStatus(getStoreId(store)!)
                                addToast({
                                  type: 'success',
                                  message: `Store ${action}d successfully`
                                })
                                await loadStore()
                              }
                            })
                          }}
                        >
                          {store.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    {store.image_url ? (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Store Image</Label>
                        <img
                          src={store.image_url}
                          alt={store.name}
                          className="w-full h-48 object-cover rounded-lg mt-2"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mt-2">
                        <div className="text-center">
                          <Image className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-sm text-muted-foreground">No image uploaded</p>
                        </div>
                      </div>                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours Card */}
              <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>Set your store operating hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(customization.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4">                        <div className="w-20">
                          <Label className="text-sm capitalize">{day}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={hours.isOpen}
                            onCheckedChange={(checked: boolean) => 
                              setCustomization(prev => ({
                                ...prev,
                                businessHours: {
                                  ...prev.businessHours,
                                  [day]: { ...hours, isOpen: checked }
                                }
                              }))
                            }
                          />
                          <span className={`text-sm font-medium ${hours.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {hours.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                        {hours.isOpen && (
                          <>
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) => 
                                setCustomization(prev => ({
                                  ...prev,
                                  businessHours: {
                                    ...prev.businessHours,
                                    [day]: { ...hours, open: e.target.value }
                                  }
                                }))
                              }
                              className="w-24"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) => 
                                setCustomization(prev => ({
                                  ...prev,
                                  businessHours: {
                                    ...prev.businessHours,
                                    [day]: { ...hours, close: e.target.value }
                                  }
                                }))
                              }
                              className="w-24"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button onClick={handleCustomizationSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Business Hours
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle>Store Customization</CardTitle>
                  <CardDescription>Personalize your store appearance and behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                    <div>
                      <Label className="text-sm font-medium">Theme</Label>                      <Select value={customization.theme} onValueChange={(value: 'light' | 'dark' | 'colorful') => {
                        const newCustomization = { ...customization, theme: value }
                        setCustomization(newCustomization)
                        applyThemeChanges(newCustomization)
                      }}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {themes.map(theme => (
                            <SelectItem key={theme.value} value={theme.value}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border" 
                                  style={{ backgroundColor: theme.preview }}
                                />
                                {theme.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>                    <div>
                      <Label className="text-sm font-medium">Layout Style</Label>
                      <Select value={customization.layout} onValueChange={(value: 'grid' | 'list' | 'carousel') => {
                        const newCustomization = { ...customization, layout: value }
                        setCustomization(newCustomization)
                        applyLayoutChanges(newCustomization)
                      }}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid Layout</SelectItem>
                          <SelectItem value="list">List Layout</SelectItem>
                          <SelectItem value="carousel">Carousel Layout</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Primary Color</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="color"
                        value={customization.primaryColor}
                        onChange={(e) => {
                          const newCustomization = { ...customization, primaryColor: e.target.value }
                          setCustomization(newCustomization)
                          applyThemeChanges(newCustomization)
                        }}
                        className="w-12 h-12 p-1 rounded border"
                      />
                      <Input
                        type="text"
                        value={customization.primaryColor}
                        onChange={(e) => {
                          const newCustomization = { ...customization, primaryColor: e.target.value }
                          setCustomization(newCustomization)
                          applyThemeChanges(newCustomization)
                        }}
                        className="flex-1"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Display Options</h3>
                    <div className="space-y-3">                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Show Store Rating</Label>
                        <Switch
                          checked={customization.showRating}
                          onCheckedChange={(checked: boolean) => {
                            const newCustomization = { ...customization, showRating: checked }
                            setCustomization(newCustomization)
                            applyDisplayChanges(newCustomization)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Show Customer Reviews</Label>
                        <Switch
                          checked={customization.showReviews}
                          onCheckedChange={(checked: boolean) => {
                            const newCustomization = { ...customization, showReviews: checked }
                            setCustomization(newCustomization)
                            applyDisplayChanges(newCustomization)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Auto-approve Orders</Label>
                        <Switch
                          checked={customization.autoApproveOrders}
                          onCheckedChange={(checked: boolean) => {
                            const newCustomization = { ...customization, autoApproveOrders: checked }
                            setCustomization(newCustomization)
                            applyDisplayChanges(newCustomization)
                          }}
                        />
                      </div>                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Enable Notifications</Label>
                        <Switch
                          checked={customization.notificationsEnabled}
                          onCheckedChange={(checked: boolean) => {
                            const newCustomization = { ...customization, notificationsEnabled: checked }
                            setCustomization(newCustomization)
                            applyNotificationChanges(newCustomization)
                          }}
                        />
                      </div>
                    </div>                  </div>                  <div className="flex gap-2">
                    <Button onClick={handleCustomizationSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Customization
                    </Button>
                    <Button variant="outline" onClick={handleExportSettings}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Settings
                    </Button>
                    <Button variant="outline" onClick={() => document.getElementById('import-settings')?.click()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Import Settings
                    </Button>
                    <input
                      id="import-settings"
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Store Dialog */}
        <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-border/30">
            <form onSubmit={handleStoreSubmit}>
              <DialogHeader>
                <DialogTitle>{editingStore ? 'Edit Store' : 'Create Your Store'}</DialogTitle>
                <DialogDescription>
                  {editingStore ? 'Update your store information' : 'Set up your store to start selling food bags'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Store Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={editingStore?.name} 
                      placeholder="Enter your store name"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" defaultValue={editingStore?.category} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={editingStore?.description} 
                    placeholder="Describe your store and what you offer"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea 
                    id="address" 
                    name="address" 
                    defaultValue={editingStore?.address} 
                    placeholder="Enter your complete store address"
                    rows={2}
                    required 
                  />
                </div>
                
                <div>
                  <Label className="flex items-center gap-2">
                    Location Coordinates *
                    <span className="text-xs text-muted-foreground">(Use Google Maps)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      name="latitude" 
                      type="number" 
                      step="any" 
                      defaultValue={editingStore?.latitude} 
                      placeholder="Latitude"
                      required 
                    />
                    <Input 
                      name="longitude" 
                      type="number" 
                      step="any" 
                      defaultValue={editingStore?.longitude} 
                      placeholder="Longitude"
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      defaultValue={editingStore?.phone} 
                      placeholder="Contact phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      defaultValue={editingStore?.email} 
                      placeholder="Store contact email"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="image_url">Store Image URL</Label>
                  <Input 
                    id="image_url" 
                    name="image_url" 
                    defaultValue={editingStore?.image_url} 
                    placeholder="https://example.com/store-image.jpg"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowStoreDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStore ? 'Update Store' : 'Create Store'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Food Bag Dialog */}
        <Dialog open={showFoodBagDialog} onOpenChange={setShowFoodBagDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-border/30">
            <form onSubmit={handleFoodBagSubmit}>
              <DialogHeader>
                <DialogTitle>{editingFoodBag ? 'Edit Food Bag' : 'Add New Food Bag'}</DialogTitle>
                <DialogDescription>
                  {editingFoodBag ? 'Update your food bag details' : 'Create a new discounted food offering'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    defaultValue={editingFoodBag?.title} 
                    placeholder="e.g., Mixed Pastries Box"
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={editingFoodBag?.description} 
                    placeholder="Describe what's included in this food bag"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original_price">Original Price *</Label>
                    <Input 
                      id="original_price" 
                      name="original_price" 
                      type="number" 
                      step="0.01" 
                      defaultValue={editingFoodBag?.original_price} 
                      placeholder="0.00"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="discounted_price">Discounted Price *</Label>
                    <Input 
                      id="discounted_price" 
                      name="discounted_price" 
                      type="number" 
                      step="0.01" 
                      defaultValue={editingFoodBag?.discounted_price} 
                      placeholder="0.00"
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="quantity_total">Total Quantity *</Label>                  <Input 
                    id="quantity_total" 
                    name="quantity_total" 
                    type="number" 
                    defaultValue={editingFoodBag?.quantity_total} 
                    placeholder="How many items available?"
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickup_time_start">Pickup Start *</Label>
                    <Input 
                      id="pickup_time_start" 
                      name="pickup_time_start" 
                      type="datetime-local" 
                      defaultValue={editingFoodBag?.pickup_time_start ? 
                        new Date(editingFoodBag.pickup_time_start).toISOString().slice(0, 16) : ''}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup_time_end">Pickup End *</Label>
                    <Input 
                      id="pickup_time_end" 
                      name="pickup_time_end" 
                      type="datetime-local" 
                      defaultValue={editingFoodBag?.pickup_time_end ? 
                        new Date(editingFoodBag.pickup_time_end).toISOString().slice(0, 16) : ''}
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" defaultValue={editingFoodBag?.category || store?.category} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input 
                    id="image_url" 
                    name="image_url" 
                    defaultValue={editingFoodBag?.image_url} 
                    placeholder="https://example.com/food-image.jpg"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowFoodBagDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFoodBag ? 'Update Food Bag' : 'Create Food Bag'}
                </Button>
              </DialogFooter>            </form>
          </DialogContent>
        </Dialog>

        {/* Customization Dialog */}
        <Dialog open={showCustomizationDialog} onOpenChange={setShowCustomizationDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-border/30">
            <DialogHeader>
              <DialogTitle>Store Customization</DialogTitle>
              <DialogDescription>
                Personalize your store appearance and behavior
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <Select value={customization.theme} onValueChange={(value: 'light' | 'dark' | 'colorful') => 
                    setCustomization(prev => ({ ...prev, theme: value }))
                  }>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map(theme => (
                        <SelectItem key={theme.value} value={theme.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: theme.preview }}
                            />
                            {theme.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Layout Style</Label>
                  <Select value={customization.layout} onValueChange={(value: 'grid' | 'list' | 'carousel') => 
                    setCustomization(prev => ({ ...prev, layout: value }))
                  }>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid Layout</SelectItem>
                      <SelectItem value="list">List Layout</SelectItem>
                      <SelectItem value="carousel">Carousel Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Primary Color</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    type="color"
                    value={customization.primaryColor}
                    onChange={(e) => {
                      const newCustomization = { ...customization, primaryColor: e.target.value }
                      setCustomization(newCustomization)
                      applyThemeChanges(newCustomization)
                    }}
                    className="w-12 h-12 p-1 rounded border"
                  />
                  <Input
                    type="text"
                    value={customization.primaryColor}
                    onChange={(e) => {
                      const newCustomization = { ...customization, primaryColor: e.target.value }
                      setCustomization(newCustomization)
                      applyThemeChanges(newCustomization)
                    }}
                    className="flex-1"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Display Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Store Rating</Label>
                    <Switch
                      checked={customization.showRating}
                      onCheckedChange={(checked: boolean) => 
                        setCustomization(prev => ({ ...prev, showRating: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Customer Reviews</Label>
                    <Switch
                      checked={customization.showReviews}
                      onCheckedChange={(checked: boolean) => 
                        setCustomization(prev => ({ ...prev, showReviews: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto-approve Orders</Label>
                    <Switch
                      checked={customization.autoApproveOrders}
                      onCheckedChange={(checked: boolean) => 
                        setCustomization(prev => ({ ...prev, autoApproveOrders: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Enable Notifications</Label>
                    <Switch
                      checked={customization.notificationsEnabled}
                      onCheckedChange={(checked: boolean) => 
                        setCustomization(prev => ({ ...prev, notificationsEnabled: checked }))
                      }
                    />
                  </div>                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCustomizationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCustomizationSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Customization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          description={confirmationModal.description}
          variant={confirmationModal.variant}
          confirmText={confirmationModal.confirmText}
          isLoading={confirmationModal.isLoading}
        />
      </div>
    </AuthenticatedLayout>
  )
}
