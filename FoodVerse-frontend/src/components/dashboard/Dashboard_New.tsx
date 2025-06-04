import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/ToastProvider'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { ConsumerDashboard } from '@/components/dashboard/ConsumerDashboard'
import { BusinessDashboard } from '@/components/dashboard/BusinessDashboard'
import { LogOut } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="FoodVerse Logo" className="h-8 w-8 shadow-lg" />
            <h1 className="text-xl font-bold text-foreground">FoodVerse</h1>
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
