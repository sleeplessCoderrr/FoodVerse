import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  User, 
  LogOut, 
  ShoppingBag, 
  Settings, 
  Bell,
  Menu,
  X,
  Home,
  Store,
  History
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/ToastProvider'

interface NavbarProps {
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  className?: string
}

export function Navbar({ onSearch, searchPlaceholder = "Search for food, stores...", className = "" }: NavbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    addToast({
      type: 'success',
      title: 'Logged out',
      message: 'You have been successfully logged out.'
    })
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Immediate search for dynamic results
    if (onSearch) {
      onSearch(e.target.value)
    }  }

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return []
    
    const baseItems = [
      { 
        name: 'Home', 
        href: '/dashboard', 
        icon: Home,
        active: location.pathname === '/dashboard'
      }
    ]

    if (user.user_type === 'consumer') {
      return [
        ...baseItems,
        { 
          name: 'Stores', 
          href: '/stores', 
          icon: Store,
          active: location.pathname === '/stores'
        },
        { 
          name: 'My Orders', 
          href: '/orders', 
          icon: History,
          active: location.pathname === '/orders'
        }
      ]    } else if (user.user_type === 'seller') {
      return [
        ...baseItems
      ]
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Determine logo link based on authentication
  const logoLink = user ? '/dashboard' : '/'

  return (
    <motion.nav 
      className={`glass sticky top-0 z-50 border-b border-border/30 backdrop-blur-md ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link to={logoLink} className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="FoodVerse Logo" 
                  className="h-8 w-8 shadow-lg group-hover:shadow-xl transition-shadow duration-200" 
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                FoodVerse
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    item.active 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>          {/* Search Bar - Only for consumers */}
          {user?.user_type === 'consumer' && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="pl-10 pr-4 h-10 bg-background/50 border-border/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative hidden md:flex">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive pl-1">
                3
              </Badge>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>                
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 glass-card border-border/30" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge variant="secondary" className="w-fit text-xs mt-1">
                      {user?.user_type === 'consumer' ? 'Consumer' : 
                       user?.user_type === 'seller' ? 'Business' : 'Admin'}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                {user?.user_type === 'consumer' && (
                  <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border/30">
              {/* Mobile Search - Only for consumers */}
              {user?.user_type === 'consumer' && (
                <div className="px-3 py-2">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className="pl-10 pr-4 h-10 bg-background/50 border-border/30"
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* Mobile Navigation */}
              {navigationItems.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start space-x-2 ${
                      item.active ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              ))}

              {/* Mobile Notifications */}
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
                <Badge className="ml-auto bg-destructive">3</Badge>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
