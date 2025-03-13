import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ShoppingBag, Utensils } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-green-600" />,
      title: "Find Nearby Deals",
      description: "Search for discounted food offers from local restaurants and food sellers in your area.",
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-green-600" />,
      title: "Place Your Order",
      description: "Reserve your food through the app and pay a small deposit to secure your order.",
    },
    {
      icon: <Utensils className="h-10 w-10 text-green-600" />,
      title: "Pickup & Enjoy",
      description:
        "Collect your food during the specified pickup window and enjoy delicious meals at a fraction of the price.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How FoodVerse Works</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Our platform makes it easy to save money and reduce food waste in just a few simple steps.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="border-2 border-green-100 dark:border-green-900/30 dark:bg-green-950/20">
              <CardHeader className="pb-2">
                <div className="mb-2 flex justify-center">{step.icon}</div>
                <CardTitle className="text-xl text-center">
                  Step {index + 1}: {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

