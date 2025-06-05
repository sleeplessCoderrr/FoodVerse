import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/ToastProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Lock, TrendingUp, ShoppingBag, Star } from 'lucide-react'
import { userService, type UpdateProfileRequest, type ChangePasswordRequest } from '@/services/userService'
import { Separator } from '../ui/separator'

interface UserStats {
  total_orders: number
  completed_orders: number
  total_savings: number
  favorite_categories: string[]
}

export function UserProfile() {
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [stats, setStats] = useState<UserStats | null>(null)
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [user])

  useEffect(() => {
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    try {
      const statsData = await userService.getUserStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      const updateData: UpdateProfileRequest = {}
      
      if (profileForm.name !== user?.name) updateData.name = profileForm.name
      if (profileForm.email !== user?.email) updateData.email = profileForm.email
      if (profileForm.phone !== user?.phone) updateData.phone = profileForm.phone
      if (profileForm.address !== user?.address) updateData.address = profileForm.address

      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        return
      }

      const updatedUser = await userService.updateProfile(updateData)
      updateUser(updatedUser)
      
      addToast({
        type: 'success',
        message: 'Profile updated successfully!'
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      addToast({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      addToast({
        type: 'error',
        message: 'New passwords do not match'
      })
      return
    }

    if (passwordForm.new_password.length < 6) {
      addToast({
        type: 'error',
        message: 'Password must be at least 6 characters long'
      })
      return
    }

    setIsChangingPassword(true)
    try {
      const changeData: ChangePasswordRequest = {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      }

      await userService.changePassword(changeData)
      
      addToast({
        type: 'success',
        message: 'Password changed successfully!'
      })
      
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
      setIsPasswordDialogOpen(false)
    } catch (error) {
      console.error('Error changing password:', error)
      addToast({
        type: 'error',
        message: 'Failed to change password. Please check your current password.'
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const cancelEdit = () => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    })
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'seller': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'consumer': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
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
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Stats */}
        {stats && (
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="glass-card border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{stats.total_orders}</p>
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
                      <p className="text-2xl font-bold">{stats.completed_orders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Savings</p>
                      <p className="text-2xl font-bold">${stats.total_savings.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="text-lg font-semibold">{formatDate(user.created_at).split(',')[1]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <Card className="lg:col-span-2 glass-card border-border/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleProfileUpdate} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.name || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className={getUserTypeColor(user.user_type)}>
                    {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder="Enter your full address"
                  rows={3}
                />
              ) : (
                <div className="flex items-start gap-2 p-2 border rounded-md bg-muted/50 min-h-[80px]">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{user.address || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Member since {formatDate(user.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card border-border/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">••••••••</p>
                </div>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-border/30">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordForm.current_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordForm.new_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordForm.confirm_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handlePasswordChange} disabled={isChangingPassword}>
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {stats && stats.favorite_categories.length > 0 && (
                <div className="p-3 border rounded-lg">
                  <p className="font-medium mb-2">Favorite Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {stats.favorite_categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Need help with your account?
              </p>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
