import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ConsumerDashboard } from './ConsumerDashboard'
import { BusinessDashboard } from './BusinessDashboard'

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to access your dashboard
          </h2>
          <p className="text-gray-600">
            You need to be authenticated to view this page.
          </p>
        </div>
      </div>
    )
  }

  // Route to appropriate dashboard based on user type
  switch (user.user_type) {
    case 'consumer':
      return <ConsumerDashboard />
    case 'business':
      return <BusinessDashboard />
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Unknown User Type
            </h2>
            <p className="text-gray-600">
              Your account type is not recognized. Please contact support.
            </p>
          </div>
        </div>
      )
  }
}

export default Dashboard