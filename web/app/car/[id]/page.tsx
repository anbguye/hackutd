"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, ArrowLeft, Calendar, GitCompare, Fuel, Users, Gauge, Zap, DollarSign } from "lucide-react"

export default function CarDetailPage() {
  const car = {
    name: "RAV4 Hybrid",
    year: 2025,
    type: "SUV",
    seats: 5,
    mpg: { city: 41, highway: 38 },
    msrp: 36000,
    drive: "AWD",
    powertrain: "Hybrid",
    image: "/toyota-rav4-hybrid.jpg",
  }

  const insurance = {
    monthly: 145,
    annual: 1740,
  }

  const financing = [
    { term: 36, payment: 1056, total: 38016, rate: 4.5 },
    { term: 48, payment: 815, total: 39120, rate: 4.5 },
    { term: 60, payment: 671, total: 40260, rate: 4.5 },
    { term: 72, payment: 577, total: 41544, rate: 4.5 },
  ]

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
                  Ask Agent
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" size="sm">
                  <GitCompare className="w-4 h-4 mr-1" />
                  Compare
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 lg:px-8 py-8">
        <Link href="/browse">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-2">{car.year} Model</Badge>
                <h1 className="text-4xl font-bold mb-2">{car.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {car.type} • {car.powertrain}
                </p>
              </div>
            </div>

            <div className="text-3xl font-bold text-accent mb-6">
              ${car.msrp.toLocaleString()}
              <span className="text-base font-normal text-muted-foreground ml-2">MSRP</span>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Fuel className="w-4 h-4" />
                  <span className="text-sm">MPG (City/Hwy)</span>
                </div>
                <p className="text-2xl font-bold">
                  {car.mpg.city}/{car.mpg.highway}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Seating</span>
                </div>
                <p className="text-2xl font-bold">{car.seats} seats</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Gauge className="w-4 h-4" />
                  <span className="text-sm">Drive Type</span>
                </div>
                <p className="text-2xl font-bold">{car.drive}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Powertrain</span>
                </div>
                <p className="text-2xl font-bold">{car.powertrain}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/test-drive" className="flex-1">
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Test Drive
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <GitCompare className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="costs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="costs">Total Costs</TabsTrigger>
            <TabsTrigger value="specs">Full Specs</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="costs" className="space-y-6">
            {/* Insurance */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">Insurance Estimate</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Monthly</p>
                  <p className="text-2xl font-bold">${insurance.monthly}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Annual</p>
                  <p className="text-2xl font-bold">${insurance.annual}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Based on average driver profile. Actual rates may vary.
              </p>
            </div>

            {/* Financing */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-xl font-bold mb-4">Financing Options</h3>
              <div className="space-y-3">
                {financing.map((option) => (
                  <div
                    key={option.term}
                    className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{option.term} months</p>
                        <p className="text-sm text-muted-foreground">{option.rate}% APR</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${option.payment}</p>
                        <p className="text-sm text-muted-foreground">/month</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="font-medium">${option.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Ownership */}
            <div className="rounded-xl border-2 border-accent bg-accent/5 p-6">
              <h3 className="text-xl font-bold mb-4">Total Monthly Cost (60 months)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Car Payment</span>
                  <span className="font-semibold">$671/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance</span>
                  <span className="font-semibold">$145/mo</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-accent text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-accent">$816/mo</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Performance</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Engine</dt>
                      <dd className="font-medium">2.5L 4-Cylinder Hybrid</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Horsepower</dt>
                      <dd className="font-medium">219 hp</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Transmission</dt>
                      <dd className="font-medium">CVT</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Dimensions</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Length</dt>
                      <dd className="font-medium">180.9 in</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Width</dt>
                      <dd className="font-medium">73.0 in</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Cargo Space</dt>
                      <dd className="font-medium">37.5 cu ft</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Standard Features</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Toyota Safety Sense 3.0",
                      "Apple CarPlay & Android Auto",
                      "8-inch Touchscreen",
                      "LED Headlights",
                      "Dual-Zone Climate Control",
                      "Power Liftgate",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Available Options</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Panoramic Moonroof",
                      "Premium Audio System",
                      "Leather Seats",
                      "Adaptive Cruise Control",
                      "Wireless Charging",
                      "Bird's Eye View Camera",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
