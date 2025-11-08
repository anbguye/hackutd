"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Car, Search, SlidersHorizontal, ArrowRight } from "lucide-react"

const cars = [
  {
    id: 1,
    name: "RAV4 Hybrid",
    year: 2025,
    type: "SUV",
    seats: 5,
    mpg: "41/38",
    msrp: 36000,
    image: "/toyota-rav4-hybrid.jpg",
  },
  {
    id: 2,
    name: "Camry",
    year: 2025,
    type: "Sedan",
    seats: 5,
    mpg: "32/41",
    msrp: 28000,
    image: "/toyota-camry-modern.png",
  },
  {
    id: 3,
    name: "Tacoma",
    year: 2025,
    type: "Truck",
    seats: 5,
    mpg: "20/23",
    msrp: 42000,
    image: "/toyota-tacoma.png",
  },
  {
    id: 4,
    name: "Highlander",
    year: 2025,
    type: "SUV",
    seats: 8,
    mpg: "21/29",
    msrp: 45000,
    image: "/toyota-highlander.png",
  },
  {
    id: 5,
    name: "Corolla",
    year: 2025,
    type: "Sedan",
    seats: 5,
    mpg: "31/40",
    msrp: 22000,
    image: "/toyota-corolla.png",
  },
  {
    id: 6,
    name: "Tundra",
    year: 2025,
    type: "Truck",
    seats: 5,
    mpg: "18/24",
    msrp: 55000,
    image: "/toyota-tundra.png",
  },
]

export default function BrowsePage() {
  const [priceRange, setPriceRange] = useState([20000, 60000])
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Toyota Agent</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  Chat with Agent
                </Button>
              </Link>
              <Link href="/compare">
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Compare
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search Toyota models..." className="pl-10 h-11" />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Seats</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="5">5 seats</SelectItem>
                      <SelectItem value="7">7+ seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select defaultValue="price-low">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="mpg">Best MPG</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Price Range</Label>
                  <span className="text-sm font-medium">
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={15000}
                  max={80000}
                  step={1000}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Browse Toyota Models</h1>
            <p className="text-muted-foreground">{cars.length} vehicles available</p>
          </div>
        </div>

        {/* Car Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Link key={car.id} href={`/car/${car.id}`}>
              <div className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                    src={car.image || "/placeholder.svg"}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-background/90 text-foreground border-0">{car.year}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {car.type} • {car.seats} seats
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Starting at</p>
                      <p className="text-xl font-bold">${car.msrp.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">MPG</p>
                      <p className="text-sm font-medium">{car.mpg}</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
