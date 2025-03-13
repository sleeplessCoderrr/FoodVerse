import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, TrendingUp, DollarSign, Leaf, BarChart, ShieldCheck } from "lucide-react"

export default function SellersPage() {
  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-500" />,
      title: "Increase Revenue",
      description:
        "Turn potential waste into profit by selling food that would otherwise go unsold at the end of the day.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600 dark:text-green-500" />,
      title: "Reduce Costs",
      description: "Lower your waste disposal costs and improve your bottom line while helping the environment.",
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600 dark:text-green-500" />,
      title: "Sustainability",
      description: "Showcase your commitment to sustainability and attract environmentally conscious customers.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-green-600 dark:text-green-500" />,
      title: "Customer Insights",
      description: "Gain valuable data on customer preferences and optimize your inventory management.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-500" />,
      title: "Brand Protection",
      description: "Maintain control over your brand with our quality assurance guidelines and seller protections.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />,
      title: "Easy Integration",
      description: "Our platform integrates seamlessly with your existing POS systems and inventory management tools.",
    },
  ]

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for small businesses just getting started",
      features: [
        "List up to 5 items per day",
        "Basic analytics dashboard",
        "Standard customer support",
        "FoodVerse listing badge",
        "10% commission on sales",
      ],
      cta: "Get Started Free",
    },
    {
      name: "Professional",
      price: "$49/month",
      description: "Ideal for established restaurants and cafes",
      features: [
        "Unlimited item listings",
        "Advanced analytics and reporting",
        "Priority customer support",
        "Featured placement in search results",
        "7.5% commission on sales",
        "Integration with POS systems",
      ],
      cta: "Start 14-Day Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large chains and food service providers",
      features: [
        "Unlimited item listings",
        "Custom analytics solutions",
        "Dedicated account manager",
        "API access for custom integrations",
        "Negotiable commission rates",
        "Multi-location management",
        "Custom branding options",
      ],
      cta: "Contact Sales",
    },
  ]

  const faqs = [
    {
      question: "How does FoodVerse work for sellers?",
      answer:
        "As a seller, you can list food items that would otherwise go unsold at the end of the day at a discounted price. Customers browse these listings and place orders for pickup during a specified time window. You receive payment upfront, reducing no-shows, and you can set your own pickup windows and discount rates.",
    },
    {
      question: "What types of businesses can join FoodVerse?",
      answer:
        "FoodVerse is open to all food businesses including restaurants, cafes, bakeries, grocery stores, delis, food trucks, and more. If you prepare or sell food and have excess inventory at the end of the day, you can benefit from our platform.",
    },
    {
      question: "How much does it cost to join?",
      answer:
        "We offer several pricing tiers, including a free Basic plan with a 10% commission on sales. Our Professional plan costs $49/month with a reduced 7.5% commission, and we offer custom Enterprise solutions for larger businesses. All plans include a 14-day free trial.",
    },
    {
      question: "Can I control what items I sell and at what discount?",
      answer:
        "You have complete control over what items you list, when they're available for pickup, and what discount you offer. While we recommend at least 50% off to attract customers, the exact discount is up to you.",
    },
    {
      question: "How do I receive payment?",
      answer:
        "Payments are processed through our platform when customers place their orders. We transfer funds to your account on a weekly basis, minus our commission. You can track all transactions through your seller dashboard.",
    },
    {
      question: "What if a customer doesn't pick up their order?",
      answer:
        "Since customers pay upfront, you're protected from financial loss if they don't show up. We have policies to discourage no-shows, including account restrictions for repeat offenders. You can decide what to do with unclaimed orders.",
    },
  ]

  const successStories = [
    {
      name: "Bella's Bakery",
      location: "San Francisco, CA",
      image: "/placeholder.svg?height=300&width=400",
      quote:
        "Since joining FoodVerse, we've reduced our daily waste by 85% and increased our revenue by $2,000 per month. The platform is incredibly easy to use and our customers love the discounts.",
      results: ["85% reduction in food waste", "$2,000 additional monthly revenue", "30+ new regular customers"],
    },
    {
      name: "Green Garden Cafe",
      location: "Austin, TX",
      image: "/placeholder.svg?height=300&width=400",
      quote:
        "FoodVerse has transformed how we handle end-of-day inventory. Instead of throwing away fresh salads and sandwiches, we're selling them at a discount and attracting new customers who often return as full-price customers.",
      results: [
        "90% reduction in food waste",
        "25% increase in overall customer base",
        "Improved sustainability metrics for B Corp certification",
      ],
    },
    {
      name: "Pasta Paradise",
      location: "Chicago, IL",
      image: "/placeholder.svg?height=300&width=400",
      quote:
        "As a family-owned restaurant, every bit of revenue matters. FoodVerse has helped us turn potential waste into profit, and the analytics tools have improved our inventory management across the board.",
      results: ["70% reduction in food waste", "$1,500 additional monthly revenue", "Improved inventory forecasting"],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Turn Food Waste into Revenue
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of food businesses reducing waste and increasing profits by selling surplus food at a
                  discount.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                  Join as a Seller
                </Button>
                <Button size="lg" variant="outline">
                  Schedule a Demo
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Restaurant owner using FoodVerse"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Benefits for Sellers</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Join FoodVerse and transform your approach to surplus food while boosting your bottom line.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-2">{benefit.icon}</div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">How It Works For Sellers</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Getting started with FoodVerse is simple. Here's how you can begin reducing waste and increasing revenue.
            </p>
          </div>

          <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <span className="font-bold text-green-800 dark:text-green-300">1</span>
              </div>
              <h3 className="font-bold">Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                Create your seller account and complete your business profile with photos and details.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <span className="font-bold text-green-800 dark:text-green-300">2</span>
              </div>
              <h3 className="font-bold">List Your Items</h3>
              <p className="text-sm text-muted-foreground">
                Add the food items you want to sell at a discount, with photos, descriptions, and allergen information.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <span className="font-bold text-green-800 dark:text-green-300">3</span>
              </div>
              <h3 className="font-bold">Receive Orders</h3>
              <p className="text-sm text-muted-foreground">
                Customers browse and purchase your discounted items through the FoodVerse app.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <span className="font-bold text-green-800 dark:text-green-300">4</span>
              </div>
              <h3 className="font-bold">Fulfill Orders</h3>
              <p className="text-sm text-muted-foreground">
                Prepare orders for pickup during your specified time window and track everything in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Success Stories</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              See how other food businesses have transformed their operations with FoodVerse.
            </p>
          </div>

          <Tabs defaultValue="story1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="story1">Bella's Bakery</TabsTrigger>
              <TabsTrigger value="story2">Green Garden Cafe</TabsTrigger>
              <TabsTrigger value="story3">Pasta Paradise</TabsTrigger>
            </TabsList>

            {successStories.map((story, index) => (
              <TabsContent key={index} value={`story${index + 1}`} className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2 items-center">
                  <div>
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.name}
                      className="rounded-lg object-cover w-full aspect-video"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">{story.name}</h3>
                      <p className="text-muted-foreground">{story.location}</p>
                    </div>
                    <blockquote className="italic border-l-4 border-green-600 pl-4 py-2">"{story.quote}"</blockquote>
                    <div>
                      <h4 className="font-semibold mb-2">Results:</h4>
                      <ul className="space-y-1">
                        {story.results.map((result, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full py-12 md:py-24 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Pricing Plans</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Choose the plan that works best for your business. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={plan.highlighted ? "border-green-600 dark:border-green-500 shadow-lg" : ""}>
                {plan.highlighted && (
                  <div className="bg-green-600 text-white text-center py-1 text-sm font-medium">Most Popular</div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && plan.price !== "Free" && (
                      <span className="text-muted-foreground ml-1">/month</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={
                      plan.highlighted
                        ? "w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        : "w-full"
                    }
                  >
                    {plan.cta}
                  </Button>
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
              Find answers to common questions about selling on FoodVerse.
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
            <h2 className="text-3xl font-bold tracking-tighter">Ready to Reduce Waste and Increase Revenue?</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Join thousands of food businesses already benefiting from FoodVerse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                Sign Up as a Seller
              </Button>
              <Button variant="outline">Schedule a Demo</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

