import { Link } from "react-router-dom"
import { ArrowRight, Heart, MapPin, Clock, Star, Users, ShoppingBag, Store, Leaf, Target, Shield, Award, ChefHat, Coffee, UtensilsCrossed, Smartphone, Timer, Globe, TrendingUp, CheckCircle, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

export function HomePage() {
  const howItWorks = [
    {
      step: "1",
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Download & Browse",
      description: "Download the FoodVerse app and explore surprise bags near you"
    },
    {
      step: "2",
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Reserve Your Bag",
      description: "Choose your favorite surprise bag and reserve it with just a few taps"
    },
    {
      step: "3",
      icon: <Timer className="h-8 w-8 text-primary" />,
      title: "Pick Up On Time",
      description: "Collect your delicious food during the specified pickup window"
    },
    {
      step: "4",
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Make a Difference",
      description: "Enjoy great food while contributing to a more sustainable planet"
    }
  ]

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "25,000+", label: "Happy Users" },
    { icon: <Store className="h-6 w-6" />, value: "800+", label: "Partner Stores" },
    { icon: <ShoppingBag className="h-6 w-6" />, value: "150,000+", label: "Meals Saved" },
    { icon: <Leaf className="h-6 w-6" />, value: "250 tons", label: "Food Waste Prevented" }
  ]

  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Quality Guaranteed",
      description: "All our partner businesses maintain high food safety standards"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Verified Partners",
      description: "Every business is carefully vetted before joining our platform"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Real Impact",
      description: "Track your personal contribution to reducing food waste"
    }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0EEE6] via-[#F0EEE6] to-[#F5F3ED] dark:from-[#262624] dark:via-[#2A2A28] dark:to-[#1E1E1C]">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">              
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="FoodVerse Logo" className="h-8 w-8 shadow-lg" />
              <span className="text-xl font-bold text-foreground">FoodVerse</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:bg-primary/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>      
      
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 lg:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Leaf className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-foreground">Join the sustainable food revolution</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Save Money,{" "}
              <span className="text-primary relative">
                Save the Planet
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-primary rounded-full"></div>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Discover surprise bags from local businesses at amazing prices. Join thousands in fighting food waste 
              while enjoying delicious meals from your favorite restaurants, cafes, and stores.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Saving Food
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg glass-card border-primary/30 hover:bg-primary/10 transform hover:scale-105 transition-all duration-200">
                  I'm a Business
                </Button>
              </Link>
            </motion.div>
            
            {/* Quick Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Trusted by 25,000+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">800+ partner stores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Available in 15+ cities</span>
              </div>
            </motion.div>
          </div>
        </div>        
      </motion.section>      {/* Gap Section */}
      <div className="py-20"></div>

      {/* How It Works Section */}
      <motion.section 
        className="relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >          <div className="max-w-6xl mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground">
                Four simple steps to start making a difference
              </p>
            </motion.div>
            
            {/* Timeline Layout */}
            <div className="relative">
              {/* Central Timeline Line */}
              <motion.div 
                className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-primary/60 to-primary/20 hidden md:block"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                viewport={{ once: true }}
              ></motion.div>
              
              <div className="space-y-16">
                {howItWorks.map((step, index) => (
                  <motion.div 
                    key={index} 
                    className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    {/* Content Side */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                      <motion.div 
                        className="glass-card p-8 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <motion.div 
                            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {step.icon}
                          </motion.div>
                          <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                      </motion.div>
                    </div>
                    
                    {/* Center Step Number */}
                    <motion.div 
                      className="relative z-10 flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center my-8 md:my-0 shadow-lg"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                      {/* Pulse Animation */}
                      <motion.div 
                        className="absolute inset-0 bg-primary rounded-full opacity-30"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                    </motion.div>
                    
                    {/* Visual Side */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                      <motion.div 
                        className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div 
                          className="text-6xl opacity-20"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          {step.icon}
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>        </motion.section>      {/* Features Section - Split Layout with Interactive Elements */}
      <motion.section 
        className="py-20 glass relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 30, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.3, 1, 1.3],
              x: [0, -30, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose FoodVerse?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're making it easy for everyone to contribute to a more sustainable future while saving money
            </p>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Large Feature - Left Side */}
            <div className="lg:col-span-2 glass-card rounded-3xl p-8 border-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Reduce Food Waste</h3>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      Help businesses sell surplus food at discounted prices instead of throwing it away. 
                      Every surprise bag you purchase prevents food from ending up in landfills.
                    </p>
                    
                    {/* Interactive Counter */}
                    <div className="bg-muted/30 rounded-2xl p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-1">250</div>
                          <div className="text-sm text-muted-foreground">Tons Saved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-1">15</div>
                          <div className="text-sm text-muted-foreground">Cities Covered</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Stacked Features */}
            <div className="space-y-8">
              {/* Money Saving Feature */}
              <div className="glass-card rounded-2xl p-6 border-0 group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-target/20 to-target/10 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">Save Money</h4>
                </div>
                <p className="text-muted-foreground mb-4">Get quality food at up to 50% off regular prices.</p>
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <span className="text-sm text-muted-foreground">Avg. Savings</span>
                  <span className="text-lg font-bold text-primary">50%</span>
                </div>
              </div>
              
              {/* Location Feature */}
              <div className="glass-card rounded-2xl p-6 border-0 group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-mappin/20 to-mappin/10 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">Find Nearby</h4>
                </div>
                <p className="text-muted-foreground">Discover participating stores in your area.</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Row - Horizontal Feature */}
          <div className="glass-card rounded-3xl p-8 border-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Easy Pickup</h3>
                    <p className="text-muted-foreground">Reserve and collect at your convenience</p>
                  </div>
                </div>
                
                {/* Process Steps */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-sm font-medium text-foreground">Reserve</span>
                  </div>
                  <div className="w-8 h-px bg-primary/30"></div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-sm font-medium text-foreground">Navigate</span>
                  </div>
                  <div className="w-8 h-px bg-primary/30"></div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-sm font-medium text-foreground">Pickup</span>
                  </div>
                </div>
              </div>
              
              {/* Visual Element */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
                    <div className="text-2xl font-bold text-primary">15min</div>
                    <div className="text-sm text-muted-foreground">Avg. Pickup Time</div>
                  </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold">
                  Fast!
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Benefits - Different Layout */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Trust & Quality Guaranteed
              </h3>
            </div>
            
            {/* Accordion-style Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="glass-card rounded-2xl border-0 overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-6 p-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>          </div>
        </div>
      </motion.section>{/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Growing Impact
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of users making a real difference in their communities every day
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-foreground/30 transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-br from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Call to Action in Stats */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary-foreground/20 backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Growing 20% monthly - Be part of the movement!</span>
            </div>
          </div>
        </div>
      </section>      {/* Testimonials Section */}
      <section className="py-20 glass relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Users & Businesses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our community has to say about their FoodVerse experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 relative overflow-hidden">
              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
              
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-xl">"Life-changing app!"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "I've saved over $300 this month while getting amazing food from top restaurants. The surprise bags are always full of delicious items, and I love knowing I'm helping reduce waste!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">Jakarta • Consumer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-secondary/60"></div>
              
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-xl">"Perfect for our bakery"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "FoodVerse has transformed our business! We now sell 90% of our day-old pastries instead of throwing them away. Our customers love the surprise bags and we're making a real environmental impact."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Ahmad's Bakery</div>
                    <div className="text-sm text-muted-foreground">Bandung • Partner Business</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/60"></div>
              
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <CardTitle className="text-xl">"Convenient and sustainable"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "The app is incredibly user-friendly. I can quickly find great deals near my office and pick them up on my way home. It feels amazing to contribute to reducing food waste while saving money!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Rina Sari</div>
                    <div className="text-sm text-muted-foreground">Surabaya • Regular User</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Social Proof */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-sm font-medium text-muted-foreground">Featured in:</div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <span className="text-sm text-muted-foreground">TechCrunch</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <span className="text-sm text-muted-foreground">Forbes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <span className="text-sm text-muted-foreground">Startup Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Enhanced CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-card p-12 rounded-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 mb-6">
              <Leaf className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Start your sustainable journey</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the FoodVerse community today and start saving money while helping save the planet. 
              Together, we can create a more sustainable future, one meal at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/register?type=consumer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Users className="mr-2 h-5 w-5" />
                  Sign Up as Consumer
                </Button>
              </Link>
              <Link to="/register?type=business">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg glass-card border-primary/30 hover:bg-primary/10 transform hover:scale-105 transition-all duration-200">
                  <Store className="mr-2 h-5 w-5" />
                  Join as Business
                </Button>
              </Link>
            </div>
            
            {/* Quick Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Free to join</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Instant savings</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Make an impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Enhanced Footer */}
      <footer className="glass-card border-t border-border/30 text-foreground py-16 mt-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <img src="/logo.png" alt="FoodVerse Logo" className="h-10 w-10 shadow-lg" />
                <span className="text-2xl font-bold text-foreground">FoodVerse</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Fighting food waste one meal at a time. Join the movement for a more sustainable future 
                and discover amazing food at incredible prices.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors duration-200 cursor-pointer">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors duration-200 cursor-pointer">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors duration-200 cursor-pointer">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
            
            {/* For Consumers */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">For Consumers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/register?type=consumer" className="hover:text-primary transition-colors duration-200 flex items-center space-x-2"><Users className="h-4 w-4" /><span>Sign Up Free</span></Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors duration-200">Login</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">How it Works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Find Stores</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Mobile App</a></li>
              </ul>
            </div>
            
            {/* For Businesses */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">For Businesses</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/register?type=business" className="hover:text-primary transition-colors duration-200 flex items-center space-x-2"><Store className="h-4 w-4" /><span>Partner with Us</span></Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors duration-200">Business Login</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Success Stories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Resources</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">API Documentation</a></li>
              </ul>
            </div>
            
            {/* Support & Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">Support & Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-border/30 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-muted-foreground text-center md:text-left">
                <p>&copy; 2025 FoodVerse. All rights reserved. Made with <Heart className="inline h-4 w-4 text-primary mx-1" /> for a sustainable future.</p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span>Carbon Neutral Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
