import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ConsumerDashboard } from './ConsumerDashboard'
import { BusinessDashboard } from './BusinessDashboard'
import { AdminDashboard } from './AdminDashboard'

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="text-center glass-card p-8 rounded-lg shadow-2xl border border-border/30">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Please log in to access your dashboard
          </h2>
          <p className="text-muted-foreground">
            You need to be authenticated to view this page.
          </p>
        </div>
      </div>
    )
  }  // Route to appropriate dashboard based on user type
  switch (user.user_type) {
    case 'consumer':
      return <ConsumerDashboard />
    case 'seller':
      return <BusinessDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
          <div className="text-center glass-card p-8 rounded-lg shadow-2xl border border-border/30">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Unknown User Type
            </h2>
            <p className="text-muted-foreground">
              Your account type is not recognized. Please contact support.
            </p>
          </div>
        </div>
      )
  }
}

export default Dashboard