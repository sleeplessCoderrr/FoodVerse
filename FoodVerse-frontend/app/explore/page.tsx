"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, MapPin, Clock, Filter, Grid, List, Map, Star, X } from "lucide-react"
import ExploreMap from "@/components/explore-map"
import { useMediaQuery } from "@/hooks/use-media-query"

// Sample data - in a real app, this would come from an API
const allListings = [
  {
    id: 1,
    name: "Bella's Bakery",
    description: "Fresh pastries and bread at 50% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "50%",
    rating: 4.8,
    closingTime: "8:00 PM",
    distance: 0.8,
    tags: ["Bakery", "Pastries", "Bread"],
    address: "123 Main St, Anytown",
    category: "Bakery",
    available: "today",
  },
  {
    id: 2,
    name: "Green Garden Cafe",
    description: "Organic salads and sandwiches at 60% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "60%",
    rating: 4.5,
    closingTime: "9:00 PM",
    distance: 1.2,
    tags: ["Cafe", "Organic", "Vegan"],
    address: "456 Oak Ave, Anytown",
    category: "Cafe",
    available: "today",
  },
  {
    id: 3,
    name: "Pasta Paradise",
    description: "Homemade pasta dishes at 55% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "55%",
    rating: 4.7,
    closingTime: "10:00 PM",
    distance: 0.5,
    tags: ["Italian", "Pasta", "Dinner"],
    address: "789 Elm St, Anytown",
    category: "Restaurant",
    available: "tomorrow",
  },
  {
    id: 4,
    name: "Sushi Station",
    description: "Fresh sushi rolls at 65% off before closing",
    image: "/placeholder.svg?height=200&width=300",
    discount: "65%",
    rating: 4.9,
    closingTime: "9:30 PM",
    distance: 1.5,
    tags: ["Japanese", "Sushi", "Seafood"],
    address: "101 Pine Rd, Anytown",
    category: "Restaurant",
    available: "now",
  },
  {
    id: 5,
    name: "Taco Time",
    description: "Authentic Mexican tacos at 50% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "50%",
    rating: 4.6,
    closingTime: "10:30 PM",
    distance: 0.7,
    tags: ["Mexican", "Tacos", "Dinner"],
    address: "202 Cedar Ln, Anytown",
    category: "Fast Food",
    available: "now",
  },
  {
    id: 6,
    name: "Pizza Place",
    description: "Handmade pizzas at 55% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "55%",
    rating: 4.4,
    closingTime: "11:00 PM",
    distance: 1.0,
    tags: ["Italian", "Pizza", "Dinner"],
    address: "303 Maple Dr, Anytown",
    category: "Fast Food",
    available: "tomorrow",
  },
  {
    id: 7,
    name: "Vegan Delights",
    description: "Plant-based meals at 70% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "70%",
    rating: 4.7,
    closingTime: "9:00 PM",
    distance: 2.3,
    tags: ["Vegan", "Healthy", "Organic"],
    address: "404 Birch Blvd, Anytown",
    category: "Vegan",
    available: "today",
  },
  {
    id: 8,
    name: "Sweet Treats",
    description: "Desserts and pastries at 60% off",
    image: "/placeholder.svg?height=200&width=300",
    discount: "60%",
    rating: 4.8,
    closingTime: "8:30 PM",
    distance: 3.1,
    tags: ["Dessert", "Bakery", "Sweets"],
    address: "505 Walnut Way, Anytown",
    category: "Dessert",
    available: "now",
  },
]

const categories = [
  { id: "bakery", label: "Bakery" },
  { id: "cafe", label: "Cafe" },
  { id: "restaurant", label: "Restaurant" },
  { id: "fastfood", label: "Fast Food" },
  { id: "vegan", label: "Vegan" },
  { id: "organic", label: "Organic" },
  { id: "glutenfree", label: "Gluten Free" },
  { id: "dessert", label: "Dessert" },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [maxDistance, setMaxDistance] = useState([5])
  const [minDiscount, setMinDiscount] = useState([50])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("distance")
  const [filteredListings, setFilteredListings] = useState(allListings)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Apply filters
  useEffect(() => {
    let results = [...allListings]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (listing) =>
          listing.name.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          listing.address.toLowerCase().includes(query),
      )
    }

    // Apply distance filter
    results = results.filter((listing) => listing.distance <= maxDistance[0])

    // Apply discount filter
    results = results.filter((listing) => {
      const discountValue = Number.parseInt(listing.discount)
      return discountValue >= minDiscount[0]
    })

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter((listing) =>
        selectedCategories.some(
          (cat) =>
            listing.category.toLowerCase() === cat.toLowerCase() ||
            listing.tags.some((tag) => tag.toLowerCase() === cat.toLowerCase()),
        ),
      )
    }

    // Apply availability filter
    if (availabilityFilter.length > 0) {
      results = results.filter((listing) => availabilityFilter.includes(listing.available))
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "discount":
          return Number.parseInt(b.discount) - Number.parseInt(a.discount)
        case "rating":
          return b.rating - a.rating
        default:
          return a.distance - b.distance
      }
    })

    setFilteredListings(results)
  }, [searchQuery, maxDistance, minDiscount, selectedCategories, availabilityFilter, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleAvailability = (availability: string) => {
    setAvailabilityFilter((prev) =>
      prev.includes(availability) ? prev.filter((a) => a !== availability) : [...prev, availability],
    )
  }

  const resetFilters = () => {
    setSearchQuery("")
    setMaxDistance([5])
    setMinDiscount([50])
    setSelectedCategories([])
    setAvailabilityFilter([])
    setSortBy("distance")
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-sm px-2">
          Reset All
        </Button>
      </div>

      <div>
        <h3 className="font-medium mb-3">Distance</h3>
        <Slider value={maxDistance} onValueChange={setMaxDistance} max={10} step={0.5} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0 mi</span>
          <span>{maxDistance[0]} mi</span>
          <span>10 mi</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Minimum Discount</h3>
        <Slider value={minDiscount} onValueChange={setMinDiscount} max={90} step={5} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0%</span>
          <span>{minDiscount[0]}%</span>
          <span>90%</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`desktop-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <label
                htmlFor={`desktop-${category.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Pickup Time</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="desktop-now"
              checked={availabilityFilter.includes("now")}
              onCheckedChange={() => toggleAvailability("now")}
            />
            <label
              htmlFor="desktop-now"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Available Now
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="desktop-today"
              checked={availabilityFilter.includes("today")}
              onCheckedChange={() => toggleAvailability("today")}
            />
            <label
              htmlFor="desktop-today"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Today
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="desktop-tomorrow"
              checked={availabilityFilter.includes("tomorrow")}
              onCheckedChange={() => toggleAvailability("tomorrow")}
            />
            <label
              htmlFor="desktop-tomorrow"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tomorrow
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container px-4 py-6 md:py-10">
        <h1 className="text-3xl font-bold mb-6">Explore Food Deals</h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, restaurant, or food type..."
              className="pl-9 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {isMobile ? (
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <FilterContent />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            )}
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Near Me</span>
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategories.length > 0 ||
          availabilityFilter.length > 0 ||
          maxDistance[0] !== 5 ||
          minDiscount[0] !== 50) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map((cat) => {
              const category = categories.find((c) => c.id === cat)
              return (
                <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                  {category?.label}
                  <button onClick={() => toggleCategory(cat)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}

            {availabilityFilter.map((avail) => (
              <Badge key={avail} variant="secondary" className="flex items-center gap-1">
                {avail === "now" ? "Available Now" : avail === "today" ? "Today" : "Tomorrow"}
                <button onClick={() => toggleAvailability(avail)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {maxDistance[0] !== 5 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Within {maxDistance[0]} miles
                <button onClick={() => setMaxDistance([5])} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {minDiscount[0] !== 50 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {minDiscount[0]}%+ off
                <button onClick={() => setMinDiscount([50])} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs">
              Clear All
            </Button>
          </div>
        )}

        {/* View Tabs */}
        <Tabs defaultValue="grid" className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-1">
                <Grid className="h-4 w-4" />
                <span>Grid</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                <span>Map</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                className="text-sm border rounded p-1 bg-background"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="distance">Distance</option>
                <option value="discount">Discount</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar - Desktop */}
            {!isMobile && isFilterOpen && (
              <div className="w-64 shrink-0">
                <div className="border rounded-lg p-4 sticky top-20">
                  <FilterContent />
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1">
              {filteredListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find any listings matching your search criteria. Try adjusting your filters or search
                    query.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <>
                  <TabsContent value="grid" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredListings.map((listing) => (
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
                            <p className="text-sm text-muted-foreground mb-2">{listing.description}</p>
                            <p className="text-sm flex items-center gap-1 mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>{listing.address}</span>
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {listing.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
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
                              <span>{listing.distance} miles</span>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="list" className="mt-0">
                    <div className="space-y-4">
                      {filteredListings.map((listing) => (
                        <Card
                          key={listing.id}
                          className="overflow-hidden transition-all hover:shadow-lg dark:border-green-900/20 dark:hover:border-green-900/30"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="relative md:w-1/3">
                              <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                                {listing.discount} OFF
                              </Badge>
                              <img
                                src={listing.image || "/placeholder.svg"}
                                alt={listing.name}
                                className="object-cover w-full h-48 md:h-full"
                              />
                            </div>
                            <div className="flex flex-col p-4 md:w-2/3">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-xl font-bold">{listing.name}</h3>
                                  <div className="flex items-center space-x-1 text-sm">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>{listing.rating}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>Closes {listing.closingTime}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{listing.distance} miles</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-muted-foreground mb-2">{listing.description}</p>
                              <p className="text-sm flex items-center gap-1 mb-2">
                                <MapPin className="h-3 w-3" />
                                <span>{listing.address}</span>
                              </p>
                              <div className="flex flex-wrap gap-1 mt-auto">
                                {listing.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="map" className="mt-0">
                    <div className="border rounded-lg overflow-hidden h-[600px]">
                      <ExploreMap listings={filteredListings} />
                    </div>
                  </TabsContent>
                </>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

