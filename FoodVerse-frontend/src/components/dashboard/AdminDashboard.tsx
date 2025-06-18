import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/components/shared/ToastProvider'
import { AuthenticatedLayout } from '@/components/shared/AuthenticatedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  UserCheck,
  UserX,
  Filter,
  RefreshCw
} from 'lucide-react'
import { sellerRequestService, type SellerRequest } from '@/services/sellerRequestService'

export function AdminDashboard() {
  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [adminComments, setAdminComments] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { addToast } = useToast()

  // Filter seller requests based on search query
  const filteredSellerRequests = sellerRequests.filter(request => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      request.user.name.toLowerCase().includes(query) ||
      request.user.email.toLowerCase().includes(query) ||
      request.id_number.toLowerCase().includes(query) ||
      request.location.toLowerCase().includes(query) ||
      request.reason.toLowerCase().includes(query)
    )
  })

  const stats = {
    pending: filteredSellerRequests.filter(req => req.status === 'pending').length,
    approved: filteredSellerRequests.filter(req => req.status === 'approved').length,
    rejected: filteredSellerRequests.filter(req => req.status === 'rejected').length,
    total: filteredSellerRequests.length
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  useEffect(() => {
    loadSellerRequests()
  }, [])

  const loadSellerRequests = async () => {
    setIsLoading(true)
    try {
      const response = await sellerRequestService.getSellerRequests({
        limit: 100
      })
      if(response.requests !== null) setSellerRequests(response.requests)
    } catch (error) {
      console.error('Error loading seller requests:', error)
      addToast({
        type: 'error',
        message: 'Failed to load seller requests'
      })
    } finally {
      setIsLoading(false)
    }
  }
  const getFilteredRequests = (status?: string) => {
    if (!status || status === 'all') return filteredSellerRequests
    return filteredSellerRequests.filter(req => req.status === status)
  }

  const openReviewDialog = (request: SellerRequest) => {
    setSelectedRequest(request)
    setAdminComments(request.admin_comments || '')
    setIsReviewDialogOpen(true)
  }

  const handleReviewSubmit = async (status: 'approved' | 'rejected') => {
    if (!selectedRequest) return

    setIsSubmittingReview(true)
    try {
      await sellerRequestService.updateSellerRequest(selectedRequest.id, {
        status,
        admin_comments: adminComments
      })

      addToast({
        type: 'success',
        message: `Seller request ${status} successfully`
      })

      // Refresh the list
      await loadSellerRequests()
      setIsReviewDialogOpen(false)
      setSelectedRequest(null)
      setAdminComments('')
    } catch (error) {
      console.error('Error updating seller request:', error)
      addToast({
        type: 'error',
        message: 'Failed to update seller request'
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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
  return (
    <AuthenticatedLayout 
      onSearch={handleSearch}
      searchPlaceholder="Search seller requests by name, email, ID, or location..."
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage seller applications and platform oversight</p>
        </div>
        <Button onClick={loadSellerRequests} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seller Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-border/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ClipboardList className="h-5 w-5" />
              Seller Applications
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Review and manage seller account applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approved ({stats.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Rejected ({stats.rejected})
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  All ({stats.total})
                </TabsTrigger>
              </TabsList>

              {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
                <TabsContent key={status} value={status} className="mt-6">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading seller requests...</p>
                    </div>
                  ) : getFilteredRequests(status === 'all' ? undefined : status).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No {status === 'all' ? '' : status} seller requests found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {getFilteredRequests(status === 'all' ? undefined : status).map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="glass-card border-border/30 hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-lg">{request.user.name}</h3>
                                  <p className="text-sm text-muted-foreground">{request.user.email}</p>
                                </div>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              </div>

                              <div className="space-y-2 text-sm mb-4">
                                <div>
                                  <span className="text-muted-foreground">ID Number:</span>
                                  <span className="ml-2 font-medium">{request.id_number}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Location:</span>
                                  <span className="ml-2 font-medium">{request.location}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Submitted:</span>
                                  <span className="ml-2 font-medium">{formatDate(request.created_at)}</span>
                                </div>
                                {request.reviewed_at && (
                                  <div>
                                    <span className="text-muted-foreground">Reviewed:</span>
                                    <span className="ml-2 font-medium">{formatDate(request.reviewed_at)}</span>
                                  </div>
                                )}
                              </div>

                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-1">Reason for applying:</p>
                                <p className="text-sm bg-muted/30 p-2 rounded text-foreground line-clamp-3">
                                  {request.reason}
                                </p>
                              </div>

                              {request.admin_comments && (
                                <div className="mb-4">
                                  <p className="text-sm text-muted-foreground mb-1">Admin Comments:</p>
                                  <p className="text-sm bg-muted/30 p-2 rounded text-foreground">
                                    {request.admin_comments}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => openReviewDialog(request)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Review
                                </Button>
                                {request.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => {
                                        setSelectedRequest(request)
                                        setAdminComments('')
                                        handleReviewSubmit('approved')
                                      }}
                                    >
                                      <UserCheck className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        setSelectedRequest(request)
                                        setAdminComments('')
                                        setIsReviewDialogOpen(true)
                                      }}
                                    >
                                      <UserX className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] glass-card border-border/30 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Review Seller Application</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>Review application from {selectedRequest.user.name}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Applicant Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Name:</span> {selectedRequest.user.name}</div>
                    <div><span className="text-muted-foreground">Email:</span> {selectedRequest.user.email}</div>
                    <div><span className="text-muted-foreground">ID Number:</span> {selectedRequest.id_number}</div>
                    <div><span className="text-muted-foreground">Location:</span> {selectedRequest.location}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Application Status</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </Badge>
                    </div>
                    <div><span className="text-muted-foreground">Submitted:</span> {formatDate(selectedRequest.created_at)}</div>
                    {selectedRequest.reviewed_at && (
                      <div><span className="text-muted-foreground">Reviewed:</span> {formatDate(selectedRequest.reviewed_at)}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Face Image */}
              {selectedRequest.face_image_url && (
                <div>
                  <h4 className="font-semibold mb-2">Face Photo</h4>
                  <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={selectedRequest.face_image_url} 
                      alt="Applicant face" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-avatar.png'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <h4 className="font-semibold mb-2">Reason for Applying</h4>
                <p className="text-sm bg-muted/30 p-3 rounded-lg">
                  {selectedRequest.reason}
                </p>
              </div>

              {/* Admin Comments */}
              <div>
                <Label htmlFor="admin-comments">Admin Comments</Label>
                <Textarea
                  id="admin-comments"
                  placeholder="Add comments about this application..."
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isSubmittingReview}
            >
              Close
            </Button>
            {selectedRequest?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleReviewSubmit('rejected')}
                  disabled={isSubmittingReview}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleReviewSubmit('approved')}
                  disabled={isSubmittingReview}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}
