import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample data - in a real app, this would come from an API
const sellers = [
  {
    id: 1,
    name: "Bella's Bakery",
    image: "/placeholder.svg?height=40&width=40",
    description: "Artisanal bakery specializing in sourdough bread and French pastries.",
    foodSaved: "250kg",
    joinedDate: "April 2023",
    specialties: ["Bread", "Pastries", "Cakes"],
  },
  {
    id: 2,
    name: "Green Garden Cafe",
    image: "/placeholder.svg?height=40&width=40",
    description: "Organic cafe serving fresh salads, sandwiches, and smoothies.",
    foodSaved: "320kg",
    joinedDate: "January 2023",
    specialties: ["Organic", "Vegan", "Gluten-Free"],
  },
  {
    id: 3,
    name: "Pasta Paradise",
    image: "/placeholder.svg?height=40&width=40",
    description: "Family-owned Italian restaurant with homemade pasta and authentic sauces.",
    foodSaved: "180kg",
    joinedDate: "June 2023",
    specialties: ["Italian", "Pasta", "Pizza"],
  },
]

export default function SellerHighlights() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Sellers</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Meet the local businesses making a difference in reducing food waste.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
          {sellers.map((seller) => (
            <Card
              key={seller.id}
              className="overflow-hidden transition-all hover:shadow-lg dark:border-green-900/20 dark:hover:border-green-900/30"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={seller.image} alt={seller.name} />
                  <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    {seller.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{seller.name}</CardTitle>
                  <CardDescription>Joined {seller.joinedDate}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{seller.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {seller.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="text-xs dark:bg-green-900/30 dark:text-green-100"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                  <span>Food Saved: {seller.foodSaved}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

