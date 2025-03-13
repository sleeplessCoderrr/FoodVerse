import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Star } from "lucide-react"

// Sample data - in a real app, this would come from an API
const listings = [
  {
    id: 1,
    name: "Bella's Bakery",
    description: "Fresh pastries and bread at 50% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "50%",
    rating: 4.8,
    closingTime: "8:00 PM",
    distance: "0.8 miles",
    tags: ["Bakery", "Pastries", "Bread"],
  },
  {
    id: 2,
    name: "Green Garden Cafe",
    description: "Organic salads and sandwiches at 60% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "60%",
    rating: 4.5,
    closingTime: "9:00 PM",
    distance: "1.2 miles",
    tags: ["Cafe", "Organic", "Vegan"],
  },
  {
    id: 3,
    name: "Pasta Paradise",
    description: "Homemade pasta dishes at 55% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "55%",
    rating: 4.7,
    closingTime: "10:00 PM",
    distance: "0.5 miles",
    tags: ["Italian", "Pasta", "Dinner"],
  },
  {
    id: 4,
    name: "Sushi Station",
    description: "Fresh sushi rolls at 65% off before closing",
    image: "/placeholder.svg?height=200&width=300",
    discount: "65%",
    rating: 4.9,
    closingTime: "9:30 PM",
    distance: "1.5 miles",
    tags: ["Japanese", "Sushi", "Seafood"],
  },
]

export default function FoodListings() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Deals Today</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Discover these amazing offers from local food sellers in your area.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden transition-all hover:shadow-lg dark:border-green-900/20 dark:hover:border-green-900/30"
            >
              <div className="relative">
                <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                  {listing.discount} OFF
                </Badge>
                <img
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.name}
                  className="object-cover w-full h-48"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">{listing.name}</CardTitle>
                <div className="flex items-center space-x-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{listing.rating}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription className="mb-2">{listing.description}</CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {listing.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs dark:border-green-900/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Closes {listing.closingTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{listing.distance}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

