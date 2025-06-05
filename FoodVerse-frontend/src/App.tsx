import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { SellerRequestForm } from './components/auth/SellerRequestForm'
import { ProtectedRoute } from './components/shared/ProtectedRoute'
import { HomePage } from './components/pages/HomePage'
import { StoreDiscoveryPage } from './components/pages/StoreDiscoveryPage'
import { StoreDetailPage } from './components/pages/StoreDetailPage'
import { UserProfile } from './components/profile/UserProfile'
import { OrderHistory } from './components/orders/OrderHistory'
import { OrderView } from './components/orders/OrderView'
import { useAuth } from './contexts/AuthContext'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src="/logo.png" alt="FoodVerse Logo" className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading FoodVerse...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route 
          path="/" 
          element={<HomePage />} 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          } 
        />
        <Route 
          path="/seller-request" 
          element={<SellerRequestForm />} 
        />
        <Route 
          path="/stores" 
          element={<StoreDiscoveryPage />} 
        />
        <Route 
          path="/stores/:storeId" 
          element={<StoreDetailPage />} 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderView />
            </ProtectedRoute>
          }
        />
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
