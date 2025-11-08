"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Check } from "lucide-react"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { LogoutButton } from "@/components/auth/LogoutButton"

const availableCars = [
  {
    id: 1,
    name: "RAV4 Hybrid",
    year: 2025,
    type: "SUV",
    seats: 5,
    mpg: { city: 41, highway: 38 },
    msrp: 36000,
    drive: "AWD",
    insurance: 145,
  },
  {
    id: 2,
    name: "Camry",
    year: 2025,
    type: "Sedan",
    seats: 5,
    mpg: { city: 32, highway: 41 },
    msrp: 28000,
    drive: "FWD",
    insurance: 120,
  },
  {
    id: 3,
    name: "Highlander",
    year: 2025,
    type: "SUV",
    seats: 8,
    mpg: { city: 21, highway: 29 },
    msrp: 45000,
    drive: "AWD",
    insurance: 165,
  },
]

export default function ComparePage() {
  const [selectedCars, setSelectedCars] = useState([availableCars[0], availableCars[1], availableCars[2]])

  return (
    <RequireAuth>
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
                  Ask Agent
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="sm">
                  Browse All
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Compare Toyota Models</h1>
          <p className="text-muted-foreground">See how different models stack up side-by-side</p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold w-48">Feature</th>
                    {selectedCars.map((car) => (
                      <th key={car.id} className="px-6 py-4 text-left min-w-[280px]">
                        <div className="space-y-3">
                          <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                            <img
                              src={`/toyota-.jpg?height=200&width=300&query=Toyota+${car.name}`}
                              alt={car.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Badge className="mb-2">{car.year}</Badge>
                            <h3 className="font-bold text-lg">{car.name}</h3>
                            <p className="text-sm text-muted-foreground">{car.type}</p>
                          </div>
                          <div className="text-2xl font-bold text-accent">${car.msrp.toLocaleString()}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">Starting Price</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="px-6 py-4">
                        <span className="text-lg font-bold">${car.msrp.toLocaleString()}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-6 py-4 text-sm font-medium">MPG (City/Hwy)</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="px-6 py-4">
                        <span className="font-semibold">
                          {car.mpg.city}/{car.mpg.highway}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">Seating</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="px-6 py-4">
                        <span className="font-semibold">{car.seats} seats</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-6 py-4 text-sm font-medium">Drive Type</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="px-6 py-4">
                        <span className="font-semibold">{car.drive}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">Est. Insurance</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="px-6 py-4">
                        <span className="font-semibold">${car.insurance}/mo</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-6 py-4 text-sm font-medium">Toyota Safety Sense</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="px-6 py-4">
                        <Check className="w-5 h-5 text-accent" />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">Apple CarPlay</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="px-6 py-4">
                        <Check className="w-5 h-5 text-accent" />
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-6 py-4 text-sm font-medium">Panoramic Moonroof</td>
                    {selectedCars.map((car, i) => (
                      <td key={car.id} className="px-6 py-4">
                        {i === 2 ? (
                          <Check className="w-5 h-5 text-accent" />
                        ) : (
                          <span className="text-muted-foreground text-sm">Optional</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium"></td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="px-6 py-4">
                        <div className="space-y-2">
                          <Link href={`/car/${car.id}`}>
                            <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
                          </Link>
                          <Link href="/test-drive">
                            <Button variant="outline" className="w-full bg-transparent">
                              Schedule Test Drive
                            </Button>
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Agent Recommendation */}
        <div className="mt-8 rounded-xl border-2 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Car className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Agent Recommendation</h3>
              <p className="text-muted-foreground mb-4">
                Based on your preferences for fuel efficiency and budget around $35,000, the{" "}
                <strong>RAV4 Hybrid</strong> is the best match. It offers excellent MPG (41/38), AWD capability, and
                falls within your target price range.
              </p>
              <Link href="/chat">
                <Button variant="outline">Ask Agent for More Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </RequireAuth>
  )
}
