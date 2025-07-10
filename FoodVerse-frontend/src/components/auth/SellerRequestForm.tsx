import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, Camera, MapPin, FileText, User, Loader2, CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { sellerRequestService, type SellerRequest } from '@/services/sellerRequestService'
import { useToast } from '@/components/shared/ToastProvider'

const sellerRequestSchema = z.object({
  id_number: z.string().min(5, 'ID number must be at least 5 characters'),
  reason: z.string().min(20, 'Please provide a detailed reason (at least 20 characters)'),
  location: z.string().min(5, 'Please provide your business location'),
  face_image_url: z.string().url('Please upload a valid face image'),
})

type SellerRequestForm = z.infer<typeof sellerRequestSchema>

export function SellerRequestForm() {
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingRequest, setExistingRequest] = useState<SellerRequest | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [aiValidationStatus, setAiValidationStatus] = useState<string | null>(null)

  const form = useForm<SellerRequestForm>({
    resolver: zodResolver(sellerRequestSchema),
    defaultValues: {
      id_number: '',
      reason: '',
      location: '',
      face_image_url: '',
    },
  })
  // Check for existing request on component mount
  useEffect(() => {
    checkExistingRequest()
  }, [])

  const checkExistingRequest = async () => {
    try {
      const request = await sellerRequestService.getMySellerRequest()
      setExistingRequest(request)
    } catch (error) {
      // No existing request found, which is fine
    }
  }
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'Invalid File',
        message: 'Please upload an image file.'
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Please upload an image smaller than 5MB.'
      })
      return
    }

    setUploadingImage(true)
    setAiValidationStatus('Validating face with AI...')
    
    try {
      const imageUrl = await sellerRequestService.uploadFaceImage(file)
      form.setValue('face_image_url', imageUrl)
      setAiValidationStatus('✅ Human face detected and validated!')
      
      addToast({
        type: 'success',
        title: 'Face Validation Successful',
        message: 'Your face image has been validated by our AI system and uploaded successfully.'
      })
    } catch (error: any) {
      setAiValidationStatus(null)
      
      addToast({
        type: 'error',
        title: 'Face Validation Failed',
        message: error.message || 'Failed to validate face image. Please try again with a clearer photo.'
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const onSubmit = async (data: SellerRequestForm) => {
    setIsSubmitting(true)
    try {
      const request = await sellerRequestService.createSellerRequest(data)
      setExistingRequest(request)
      addToast({
        type: 'success',
        title: 'Application Submitted',
        message: 'Your seller application has been submitted for review.'
      })
      form.reset()
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: error.message || 'Failed to submit application. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />
    }
  }

  // Show existing request status if it exists
  if (existingRequest) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/profile')}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Back to Profile
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  {getStatusIcon(existingRequest.status)}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                Seller Application Status
              </CardTitle>
              <CardDescription>
                Here's the current status of your seller application
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Badge className={`px-4 py-2 ${getStatusColor(existingRequest.status)}`}>
                  {existingRequest.status.charAt(0).toUpperCase() + existingRequest.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Application Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID Number:</span>
                      <span className="ml-2 font-medium">{existingRequest.id_number}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-medium">{existingRequest.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="ml-2 font-medium">
                        {new Date(existingRequest.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {existingRequest.status !== 'pending' && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Review Details</h3>
                    <div className="space-y-2 text-sm">
                      {existingRequest.reviewed_by && (
                        <div>
                          <span className="text-muted-foreground">Reviewed by:</span>
                          <span className="ml-2 font-medium">{existingRequest.reviewed_by.name}</span>
                        </div>
                      )}
                      {existingRequest.reviewed_at && (
                        <div>
                          <span className="text-muted-foreground">Reviewed on:</span>
                          <span className="ml-2 font-medium">
                            {new Date(existingRequest.reviewed_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Your Reason</h3>
                <p className="text-muted-foreground text-sm bg-muted/30 p-3 rounded-lg">
                  {existingRequest.reason}
                </p>
              </div>

              {existingRequest.admin_comments && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Admin Comments</h3>
                  <p className="text-muted-foreground text-sm bg-muted/30 p-3 rounded-lg">
                    {existingRequest.admin_comments}
                  </p>
                </div>
              )}

              {existingRequest.status === 'approved' && (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    🎉 Congratulations!
                  </h3>                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Your seller application has been approved! You can now create your store and manage food offerings.
                  </p>
                </div>
              )}

              {existingRequest.status === 'rejected' && (
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Application Not Approved
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Unfortunately, your application was not approved. Please review the admin comments above and consider reapplying in the future.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/profile')}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Back to Profile
        </Button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Become a Seller
            </CardTitle>
            <CardDescription>
              Apply to become a seller on FoodVerse and help reduce food waste while growing your business
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="id_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>ID Number</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your government issued ID number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Business Location</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your business address or intended location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to become a seller?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your business, why you want to join FoodVerse, and how you plan to help reduce food waste..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="face_image_url"
                  render={({ field }) => (
                    <FormItem>                      <FormLabel className="flex items-center space-x-2">
                        <Camera className="h-4 w-4" />
                        <span>Face Photo (AI Verified)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold">Click to upload</span> your face photo
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB • AI validation required</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                              />
                            </label>
                          </div>                          {uploadingImage && (
                            <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{aiValidationStatus || 'Processing image...'}</span>
                            </div>
                          )}
                          {!uploadingImage && aiValidationStatus && (
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>{aiValidationStatus}</span>
                            </div>
                          )}
                          {!uploadingImage && field.value && !aiValidationStatus && (
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Image uploaded successfully</span>
                            </div>
                          )}
                          <Input
                            type="hidden"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your face photo will be validated by our AI system for security</li>
                    <li>• Your application will be reviewed by our admin team</li>
                    <li>• We'll verify your identity and business information</li>
                    <li>• You'll receive an email notification about the decision</li>
                    <li>• If approved, you can create one store to start selling</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
