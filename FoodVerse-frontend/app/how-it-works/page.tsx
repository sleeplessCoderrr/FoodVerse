import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Search, ShoppingBag, Utensils, Clock, CreditCard, Smartphone, Award } from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-green-600 dark:text-green-500" />,
      title: "Find Nearby Deals",
      description:
        "Search for discounted food offers from local restaurants and food sellers in your area. Filter by cuisine type, distance, or discount percentage.",
      details: [
        "Open the FoodVerse app or website",
        "Enter your location or enable location services",
        "Browse available deals near you",
        "Filter by cuisine, distance, or discount amount",
      ],
    },
    {
      icon: <ShoppingBag className="h-12 w-12 text-green-600 dark:text-green-500" />,
      title: "Place Your Order",
      description:
        "Reserve your food through the app and pay a small deposit to secure your order. This helps sellers plan accordingly and reduces no-shows.",
      details: [
        "Select the items you want to purchase",
        "Choose your pickup time window",
        "Pay a small deposit to secure your order",
        "Receive confirmation and pickup details",
      ],
    },
    {
      icon: <Clock className="h-12 w-12 text-green-600 dark:text-green-500" />,
      title: "Pickup Window",
      description:
        "Each offer has a specific pickup window, usually near the end of the business day. This is when the food would otherwise go unsold.",
      details: [
        "Receive a reminder notification before pickup time",
        "Pickup windows are typically 30-60 minutes",
        "Late pickups may result in order cancellation",
        "Some sellers offer extended pickup times",
      ],
    },
    {
      icon: <Utensils className="h-12 w-12 text-green-600 dark:text-green-500" />,
      title: "Pickup & Enjoy",
      description:
        "Collect your food during the specified pickup window and enjoy delicious meals at a fraction of the price. Show your order confirmation to the seller.",
      details: [
        "Arrive during your pickup window",
        "Show your order confirmation to the seller",
        "Pay any remaining balance (if applicable)",
        "Enjoy your delicious discounted food!",
      ],
    },
  ]

  const faqs = [
    {
      question: "What happens if I can't pick up my order?",
      answer:
        "If you can't pick up your order during the specified window, please cancel it as soon as possible through the app. Depending on the seller's policy, you may receive a partial or full refund of your deposit. Frequent no-shows may result in account restrictions.",
    },
    {
      question: "How much of a discount can I expect?",
      answer:
        "Discounts typically range from 50% to 70% off the regular price. The exact discount depends on the seller, the type of food, and how close it is to closing time. Some sellers may offer even deeper discounts for last-minute pickups.",
    },
    {
      question: "Is the food safe to eat?",
      answer:
        "All food offered through FoodVerse is perfectly safe to eat. We're not selling expired food - we're helping businesses sell fresh food that would otherwise go unsold at the end of the day. All our partner sellers follow strict food safety guidelines.",
    },
    {
      question: "Can I see what's in my surprise bag before purchasing?",
      answer:
        "Some sellers offer 'surprise bags' where the exact contents aren't specified in advance. While the specific items are a surprise, sellers always list the category of food (e.g., 'bakery items', 'lunch items') and note any common allergens that might be included.",
    },
    {
      question: "How do I know if a seller is near me?",
      answer:
        "Our app shows you sellers based on your location. You can set your search radius and see exactly how far each seller is from you. You can also save your favorite locations (home, work, etc.) to quickly find nearby deals.",
    },
    {
      question: "Can I order in advance for a specific day?",
      answer:
        "Yes, many sellers allow you to place orders up to several days in advance. This helps them plan better and may give you access to more options. Just note that the available items may change closer to pickup time.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah J.",
      role: "Regular Customer",
      quote:
        "I've saved over $200 this month alone using FoodVerse! The food is always delicious, and I love knowing I'm helping reduce waste.",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael T.",
      role: "College Student",
      quote:
        "As a student on a budget, FoodVerse has been a game-changer. I get to try food from restaurants I couldn't normally afford.",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Priya K.",
      role: "Working Professional",
      quote:
        "I pick up dinner through FoodVerse on my way home from work several times a week. It's convenient, affordable, and environmentally conscious!",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">How FoodVerse Works</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Our platform connects you with local food sellers offering great discounts on food that would otherwise go
              to waste. Here's how you can start saving money and reducing food waste today.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={index} className="border-2 border-green-100 dark:border-green-900/30">
                <CardHeader className="pb-2">
                  <div className="mb-4 flex justify-center">
                    {step.icon}
                    <div className="absolute w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center -mt-2 -ml-16">
                      <span className="font-bold text-green-800 dark:text-green-300">{index + 1}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4">{step.description}</CardDescription>
                  <ul className="space-y-2 text-sm">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-500"></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Explainer */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">See FoodVerse in Action</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Watch our short video to see how easy it is to use FoodVerse to find great deals and reduce food waste.
            </p>
          </div>
          <div className="mx-auto max-w-4xl aspect-video bg-muted rounded-xl flex items-center justify-center border">
            <div className="text-center p-8">
              <p className="text-muted-foreground mb-4">
                Video placeholder - would embed an actual tutorial video here
              </p>
              <Button variant="outline">Watch Video</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Benefits of Using FoodVerse</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              FoodVerse helps you save money while making a positive impact on the environment.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-center">Save Money</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Get delicious food from your favorite local spots at 50-70% off regular prices. Save hundreds of
                  dollars each month while enjoying quality meals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-center">Reduce Waste</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Help prevent perfectly good food from ending up in landfills. Each purchase through FoodVerse directly
                  reduces food waste and its environmental impact.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto">
                  <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-center">Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Our intuitive app makes finding and ordering discounted food quick and simple. Browse, order, and pick
                  up with just a few taps on your phone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">What Our Users Say</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Join thousands of satisfied users who are saving money and reducing food waste with FoodVerse.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="rounded-full w-16 h-16 object-cover"
                    />
                    <div>
                      <p className="italic mb-4">"{testimonial.quote}"</p>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Find answers to common questions about using FoodVerse.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Ready to Start Saving?</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Download the FoodVerse app today and join the movement to reduce food waste while enjoying great deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                Download the App
              </Button>
              <Button variant="outline">Browse Deals Now</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

