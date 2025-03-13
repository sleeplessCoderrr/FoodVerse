import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import FoodListings from "@/components/food-listings"
import HowItWorks from "@/components/how-it-works"
import SellerHighlights from "@/components/seller-highlights"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white dark:from-green-950/50 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Save Food, Save Money, Save the Planet
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Connect with local food sellers offering 50% or more off on delicious food that would otherwise go to
                  waste.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 dark:text-white"
                >
                  Find Food Near Me
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/50"
                >
                  I'm a Seller
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 dark:from-green-500/10 dark:to-green-700/10 z-10 rounded-xl" />
                <img
                  src="/placeholder.svg?height=500&width=500"
                  alt="Local food marketplace"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Find Discounted Food Near You</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Search for restaurants, cafes, and bakeries offering discounted food in your area.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Enter your location..."
                  className="w-full bg-background pl-8 rounded-full"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 rounded-full">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <FoodListings />

      {/* How It Works */}
      <HowItWorks />

      {/* Featured Sellers */}
      <SellerHighlights />

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join the Food Waste Revolution</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Whether you're a food seller looking to reduce waste or a customer seeking delicious deals, FoodVerse
                connects you.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Sign Up as a Customer
              </Button>
              <Button size="lg" variant="outline">
                Register Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

