import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mail, MapPin, Phone, Globe, Twitter, Facebook, Instagram, Linkedin, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former restaurant manager passionate about reducing food waste. Sarah founded FoodVerse after seeing firsthand how much perfectly good food was thrown away daily.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Tech entrepreneur with experience at leading food delivery platforms. Michael brings technical expertise and industry knowledge to FoodVerse.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Priya Patel",
      role: "Chief Sustainability Officer",
      bio: "Environmental scientist with a focus on food systems. Priya ensures that FoodVerse maximizes its positive environmental impact.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "David Rodriguez",
      role: "Head of Partnerships",
      bio: "Former restaurant consultant who has helped hundreds of food businesses optimize their operations. David leads our seller acquisition and success team.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const impactStats = [
    {
      value: "2.5M+",
      label: "Meals Saved",
      description: "Over 2.5 million meals have been saved from going to waste through our platform.",
    },
    {
      value: "4,500+",
      label: "Business Partners",
      description: "More than 4,500 food businesses have joined our mission to reduce food waste.",
    },
    {
      value: "12K+",
      label: "Tons of CO₂ Prevented",
      description: "By preventing food waste, we've helped avoid 12,000+ tons of greenhouse gas emissions.",
    },
    {
      value: "$8.5M+",
      label: "Saved by Consumers",
      description: "Our users have collectively saved over $8.5 million on food purchases.",
    },
  ]

  const values = [
    {
      title: "Sustainability",
      description: "We're committed to creating a more sustainable food system by reducing waste at every opportunity.",
    },
    {
      title: "Accessibility",
      description: "We believe everyone should have access to quality food at affordable prices.",
    },
    {
      title: "Transparency",
      description: "We operate with complete transparency with our users, partners, and within our team.",
    },
    {
      title: "Innovation",
      description: "We continuously innovate to create better solutions for reducing food waste.",
    },
    {
      title: "Community",
      description: "We build strong communities around shared values of sustainability and responsible consumption.",
    },
    {
      title: "Impact",
      description: "We measure our success by the positive environmental and social impact we create.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About FoodVerse</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              We're on a mission to reduce food waste by connecting consumers with discounted food that would otherwise
              go unsold.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="FoodVerse founders"
                className="rounded-lg object-cover w-full aspect-video"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Our Story</h2>
              <p className="text-muted-foreground">
                FoodVerse began in 2021 when our founders, Sarah and Michael, witnessed the staggering amount of food
                waste in the restaurant industry. As a former restaurant manager, Sarah saw firsthand how much perfectly
                good food was thrown away at the end of each day.
              </p>
              <p className="text-muted-foreground">
                They created FoodVerse with a simple idea: connect consumers with this surplus food at a discount,
                creating a win-win situation for businesses, consumers, and the planet.
              </p>
              <p className="text-muted-foreground">
                What started as a small pilot with 10 local restaurants has grown into a nationwide platform with
                thousands of partners and millions of meals saved from the landfill.
              </p>
              <p className="text-muted-foreground">
                Today, FoodVerse operates in over 50 cities across the country, and we're just getting started. Our
                vision is to create a world where no good food goes to waste, and we're working tirelessly to make that
                a reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Our Impact</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Every meal saved through FoodVerse makes a difference. Here's our impact so far.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-500">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{stat.label}</h3>
                  <CardDescription>{stat.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Our Values</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              These core principles guide everything we do at FoodVerse.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="w-full py-12 md:py-24 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Meet Our Team</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              The passionate people behind FoodVerse who are working to reduce food waste.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press and Recognition */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Press & Recognition</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              FoodVerse has been featured in leading publications and recognized for our impact.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Food & Wine Magazine</CardTitle>
                <CardDescription>June 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic mb-4">
                  "FoodVerse is revolutionizing how we think about food waste, creating a marketplace that benefits
                  everyone involved."
                </p>
                <Link href="#" className="text-green-600 dark:text-green-500 flex items-center">
                  Read Article <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">TechCrunch</CardTitle>
                <CardDescription>March 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic mb-4">
                  "This fast-growing startup is tackling food waste with an innovative marketplace approach that's
                  scaling rapidly."
                </p>
                <Link href="#" className="text-green-600 dark:text-green-500 flex items-center">
                  Read Article <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sustainability Awards</CardTitle>
                <CardDescription>November 2022</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic mb-4">
                  "FoodVerse received the 'Innovation in Food Sustainability' award for their impactful approach to
                  reducing food waste."
                </p>
                <Link href="#" className="text-green-600 dark:text-green-500 flex items-center">
                  Read Article <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Contact Us</h2>
              <p className="text-muted-foreground">
                Have questions about FoodVerse? We'd love to hear from you. Reach out to our team using the contact
                information below.
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">hello@foodverse.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">
                      123 Green Street
                      <br />
                      San Francisco, CA 94110
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Follow Us</h3>
                <div className="flex space-x-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">Send Us a Message</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below and we'll get back to you soon.
                  </p>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Mission */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-block rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300">
              Join Our Mission
            </div>
            <h2 className="text-3xl font-bold tracking-tighter">Help Us Create a World Without Food Waste</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Whether you're a consumer looking to save money or a business wanting to reduce waste, you can be part of
              the solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                <Heart className="mr-2 h-4 w-4" /> Join as a Customer
              </Button>
              <Button variant="outline">
                <Globe className="mr-2 h-4 w-4" /> Partner With Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

