import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, ArrowLeft, Leaf } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/shared/ToastProvider"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),  confirmPassword: z.string().min(6, "Please confirm your password"),
  phone: z.string().optional(),
  address: z.string().optional(),
  userType: z.literal("consumer")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuth()
  const { addToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      userType: "consumer",
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    try {
      console.log('Attempting registration with data:', { 
        name: data.name, 
        email: data.email, 
        userType: data.userType,
        phone: data.phone || undefined,
        address: data.address || undefined
      })
      
      await registerUser(data.name, data.email, data.password, data.userType, data.phone, data.address)
      
      addToast({
        type: 'success',
        title: 'Account Created!',
        message: 'Welcome to FoodVerse! Your account has been successfully created.'
      })
      navigate("/dashboard")
    } catch (error: any) {
      console.error('Registration error:', error)
      
      let errorMessage = "Registration failed. Please try again."
      
      // Handle specific error cases
      if (error.message) {
        if (error.message.includes('user already exists') || error.message.includes('duplicate')) {
          errorMessage = "An account with this email already exists. Please use a different email or try logging in."
        } else if (error.message.includes('email')) {
          errorMessage = "Please enter a valid email address."
        } else if (error.message.includes('password')) {
          errorMessage = "Password must be at least 6 characters long."
        } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
          errorMessage = "Unable to connect to the server. Please check your internet connection and try again."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: errorMessage
      })
    }  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0EEE6] via-[#F0EEE6] to-[#F5F3ED] dark:from-[#262624] dark:via-[#2A2A28] dark:to-[#1E1E1C] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        ></motion.div>
      </div>

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors duration-200 group"
            >
              <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-200">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="FoodVerse Logo" className="h-8 w-8 shadow-lg" />
                <span className="text-lg font-bold">FoodVerse</span>
              </div>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-border/30 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="p-3 bg-primary/10 rounded-full">
                  <img src="/logo.png" alt="FoodVerse Logo" className="h-12 w-12" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >                <CardTitle className="text-2xl font-bold text-foreground">Join FoodVerse</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Create your consumer account and start reducing food waste today.
                  Want to become a seller? You can apply to sell after registering!
                </CardDescription>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
              >
                <Leaf className="h-4 w-4 text-primary" />
                <span>Be part of the sustainable revolution</span>
              </motion.div>
            </CardHeader>        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />              </motion.div>
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your address"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="h-12 pr-12"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="h-12 pr-12"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive text-center glass-card bg-destructive/10 border border-destructive/20 p-3 rounded-md"
                >
                  {error}
                </motion.div>
              )}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Your FoodVerse Account
                </Button>
              </motion.div>
            </form>          </Form>
          
          <motion.div            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-8 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">Already have an account?</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                Sign in to your existing account
              </Link>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</div>
  )
}
