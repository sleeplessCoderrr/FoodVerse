"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

type Listing = {
  id: number
  name: string
  description: string
  image: string
  discount: string
  rating: number
  closingTime: string
  distance: number
  tags: string[]
  address: string
  category?: string
  available?: string
}

interface ExploreMapProps {
  listings: Listing[]
}

export default function ExploreMap({ listings }: ExploreMapProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800">
      {/* This is a placeholder for a real map integration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-muted-foreground text-center px-4">
          Map view would integrate with Google Maps, Mapbox, or similar service
        </p>
      </div>

      {/* Map pins for each listing */}
      {listings.map((listing, index) => {
        // Calculate pseudo-random positions for demonstration
        const top = 20 + ((index * 73) % 80)
        const left = 15 + ((index * 47) % 70)

        return (
          <div
            key={listing.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: `${top}%`, left: `${left}%` }}
            onClick={() => setSelectedListing(listing)}
          >
            <div className="flex flex-col items-center">
              <div className="bg-green-600 text-white rounded-full p-1 shadow-lg hover:bg-green-500 transition-colors">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full mt-1 shadow-md">
                {listing.discount} OFF
              </div>
            </div>
          </div>
        )
      })}

      {/* Info popup when a listing is selected */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border rounded-lg shadow-lg p-4 z-20">
          <div className="flex gap-3">
            <img
              src={selectedListing.image || "/placeholder.svg"}
              alt={selectedListing.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-bold">{selectedListing.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedListing.description}</p>
              <div className="flex items-center justify-between mt-2 text-sm">
                <Badge className="bg-green-600">{selectedListing.discount} OFF</Badge>
                <span className="text-muted-foreground">Closes {selectedListing.closingTime}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{selectedListing.distance} miles away</span>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
              View Details
            </Button>
          </div>
          <button
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            onClick={() => setSelectedListing(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

