import { useState, useEffect } from 'react'
import { useToast } from '@/components/ToastProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Store, MapPin, Plus, Edit, Trash2, ShoppingBag, Clock, Package } from 'lucide-react'
import { storeService, type Store as StoreType, type StoreInput } from '@/services/storeService'
import { foodBagService, type FoodBag, type FoodBagInput } from '@/services/foodBagService'

export function BusinessDashboard() {
  const [stores, setStores] = useState<StoreType[]>([])
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null)
  const [foodBags, setFoodBags] = useState<FoodBag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showStoreDialog, setShowStoreDialog] = useState(false)
  const [showFoodBagDialog, setShowFoodBagDialog] = useState(false)
  const [editingStore, setEditingStore] = useState<StoreType | null>(null)
  const [editingFoodBag, setEditingFoodBag] = useState<FoodBag | null>(null)
  const { addToast } = useToast()

  const categories = ['bakery', 'restaurant', 'grocery', 'cafe']

  useEffect(() => {
    loadStores()
  }, [])

  useEffect(() => {
    if (selectedStore) {
      loadFoodBags(selectedStore.id)
    }
  }, [selectedStore])

  const loadStores = async () => {
    setIsLoading(true)
    try {
      const response = await storeService.getOwnedStores()
      setStores(response.data)
      if (response.data.length > 0 && !selectedStore) {
        setSelectedStore(response.data[0])
      }
    } catch (error) {
      console.error('Error loading stores:', error)
      addToast({
        type: 'error',
        message: 'Failed to load your stores'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadFoodBags = async (storeId: number) => {
    try {
      const response = await foodBagService.getFoodBagsByStore(storeId)
      setFoodBags(response.data)
    } catch (error) {
      console.error('Error loading food bags:', error)
      addToast({
        type: 'error',
        message: 'Failed to load food bags'
      })
    }
  }

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
        await storeService.updateStore(editingStore.id, storeData)
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
      loadStores()
    } catch (error) {
      addToast({
        type: 'error',
        message: `Failed to ${editingStore ? 'update' : 'create'} store`
      })
    }
  }

  const handleFoodBagSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedStore) return
    
    const formData = new FormData(event.currentTarget)
    
    const foodBagData: FoodBagInput = {
      store_id: selectedStore.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      original_price: parseFloat(formData.get('original_price') as string),
      discounted_price: parseFloat(formData.get('discounted_price') as string),
      quantity_total: parseInt(formData.get('quantity_total') as string),
      pickup_time_start: formData.get('pickup_time_start') as string,
      pickup_time_end: formData.get('pickup_time_end') as string,
      image_url: formData.get('image_url') as string,
      category: formData.get('category') as string
    }

    try {
      if (editingFoodBag) {
        await foodBagService.updateFoodBag(editingFoodBag.id, foodBagData)
        addToast({
          type: 'success',
          message: 'Food bag updated successfully'
        })
      } else {
        await foodBagService.createFoodBag(foodBagData)
        addToast({
          type: 'success',
          message: 'Food bag created successfully'
        })
      }
      
      setShowFoodBagDialog(false)
      setEditingFoodBag(null)
      loadFoodBags(selectedStore.id)
    } catch (error) {
      addToast({
        type: 'error',
        message: `Failed to ${editingFoodBag ? 'update' : 'create'} food bag`
      })
    }
  }

  const handleDeleteStore = async (store: StoreType) => {
    if (window.confirm(`Are you sure you want to delete "${store.name}"?`)) {
      try {
        await storeService.deleteStore(store.id)
        addToast({
          type: 'success',
          message: 'Store deleted successfully'
        })
        loadStores()
        if (selectedStore?.id === store.id) {
          setSelectedStore(null)
          setFoodBags([])
        }
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to delete store'
        })
      }
    }
  }

  const handleDeleteFoodBag = async (foodBag: FoodBag) => {
    if (window.confirm(`Are you sure you want to delete "${foodBag.title}"?`)) {
      try {
        await foodBagService.deleteFoodBag(foodBag.id)
        addToast({
          type: 'success',
          message: 'Food bag deleted successfully'
        })
        if (selectedStore) {
          loadFoodBags(selectedStore.id)
        }
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to delete food bag'
        })
      }
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 space-y-6 p-6">
      {/* Business Overview */}
      <Card className="glass-card border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Store className="h-5 w-5" />
            Business Dashboard
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your stores and food offerings to help reduce waste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card border-border/20">
              <CardContent className="p-4">                <div className="flex items-center gap-2">
                  <Store className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stores.length}</p>
                    <p className="text-sm text-muted-foreground">Active Stores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
              <Card className="glass-card border-border/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{foodBags.length}</p>
                    <p className="text-sm text-muted-foreground">Food Bags Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-border/20">
              <CardContent className="p-4">                <div className="flex items-center gap-2">
                  <Package className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{foodBags.reduce((sum, bag) => sum + bag.quantity_left, 0)}</p>
                    <p className="text-sm text-muted-foreground">Items Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>      {/* Store Management */}
      <Card className="glass-card border-border/30 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Your Stores</CardTitle>
            <CardDescription className="text-muted-foreground">Manage your store locations and details</CardDescription>
          </div>
          <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingStore(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Store
              </Button>
            </DialogTrigger>            <DialogContent className="max-w-md glass-card border-border/30">
              <form onSubmit={handleStoreSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-foreground">{editingStore ? 'Edit Store' : 'Add New Store'}</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    {editingStore ? 'Update your store information' : 'Create a new store location'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Store Name</Label>
                    <Input id="name" name="name" defaultValue={editingStore?.name} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
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
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" defaultValue={editingStore?.description} />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" defaultValue={editingStore?.address} required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" name="latitude" type="number" step="any" defaultValue={editingStore?.latitude} required />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" name="longitude" type="number" step="any" defaultValue={editingStore?.longitude} required />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={editingStore?.phone} />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={editingStore?.email} />
                  </div>
                  
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input id="image_url" name="image_url" defaultValue={editingStore?.image_url} />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">
                    {editingStore ? 'Update Store' : 'Create Store'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading your stores...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You haven't created any stores yet. Create your first store to start selling food bags.
            </div>
          ) : (            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stores.map((store) => (
                <Card key={store.id} className={`cursor-pointer transition-all glass-card border-border/30 hover:shadow-xl hover:scale-[1.02] ${selectedStore?.id === store.id ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4" onClick={() => setSelectedStore(store)}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <Badge variant="secondary">{store.category}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingStore(store)
                            setShowStoreDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteStore(store)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2">{store.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{store.address}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>      {/* Food Bag Management */}
      {selectedStore && (
        <Card className="glass-card border-border/30 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Food Bags - {selectedStore.name}</CardTitle>
              <CardDescription className="text-muted-foreground">Manage food offerings for this store</CardDescription>
            </div>
            <Dialog open={showFoodBagDialog} onOpenChange={setShowFoodBagDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingFoodBag(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Food Bag
                </Button>
              </DialogTrigger>              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto glass-card border-border/30">
                <form onSubmit={handleFoodBagSubmit}>
                  <DialogHeader>
                    <DialogTitle className="text-foreground">{editingFoodBag ? 'Edit Food Bag' : 'Add New Food Bag'}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {editingFoodBag ? 'Update your food bag details' : 'Create a new discounted food offering'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" defaultValue={editingFoodBag?.title} required />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" defaultValue={editingFoodBag?.description} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="original_price">Original Price</Label>
                        <Input id="original_price" name="original_price" type="number" step="0.01" defaultValue={editingFoodBag?.original_price} required />
                      </div>
                      <div>
                        <Label htmlFor="discounted_price">Discounted Price</Label>
                        <Input id="discounted_price" name="discounted_price" type="number" step="0.01" defaultValue={editingFoodBag?.discounted_price} required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="quantity_total">Total Quantity</Label>
                      <Input id="quantity_total" name="quantity_total" type="number" defaultValue={editingFoodBag?.quantity_left} required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="pickup_time_start">Pickup Start</Label>
                        <Input 
                          id="pickup_time_start" 
                          name="pickup_time_start" 
                          type="datetime-local" 
                          defaultValue={editingFoodBag?.pickup_time_start ? new Date(editingFoodBag.pickup_time_start).toISOString().slice(0, 16) : ''}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickup_time_end">Pickup End</Label>
                        <Input 
                          id="pickup_time_end" 
                          name="pickup_time_end" 
                          type="datetime-local" 
                          defaultValue={editingFoodBag?.pickup_time_end ? new Date(editingFoodBag.pickup_time_end).toISOString().slice(0, 16) : ''}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue={editingFoodBag?.category || selectedStore.category} required>
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
                      <Input id="image_url" name="image_url" defaultValue={editingFoodBag?.image_url} />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">
                      {editingFoodBag ? 'Update Food Bag' : 'Create Food Bag'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {foodBags.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No food bags created for this store yet. Create your first food bag to start reducing waste.
              </div>
            ) : (              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodBags.map((foodBag) => (
                  <Card key={foodBag.id} className="glass-card border-border/30 hover:shadow-xl hover:scale-[1.02] transition-all">
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
                          <h3 className="font-semibold text-foreground">{foodBag.title}</h3>
                          <p className="text-sm text-muted-foreground">{foodBag.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              ${foodBag.discounted_price.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${foodBag.original_price.toFixed(2)}
                            </span>
                          </div>
                          <Badge variant="secondary">
                            {foodBag.quantity_left} left
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatTime(foodBag.pickup_time_start)} - {formatTime(foodBag.pickup_time_end)}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setEditingFoodBag(foodBag)
                              setShowFoodBagDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFoodBag(foodBag)}
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
      )}
    </div>
  )
}
