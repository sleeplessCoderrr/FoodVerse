import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ToastProvider'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ConsumerDashboard } from '@/components/ConsumerDashboard'
import { BusinessDashboard } from '@/components/BusinessDashboard'
import { Utensils, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    addToast({
      type: 'info',
      message: 'You have been logged out successfully.'
    })
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <Utensils className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">FoodVerse</h1>
            {user && (
              <span className="text-sm text-muted-foreground">
                ({user.user_type === 'business' ? 'Business' : 'Consumer'})
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name}!
            </span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Role-based dashboard content */}
          {user?.user_type === 'business' ? (
            <BusinessDashboard />
          ) : (
            <ConsumerDashboard />
          )}
        </div>
      </main>
    </div>
  )
}
