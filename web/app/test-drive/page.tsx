"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Car, MapPin, Clock, Check } from "lucide-react"

export default function TestDrivePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/40">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex h-16 items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Toyota Agent</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Test Drive Scheduled!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your test drive for the RAV4 Hybrid has been confirmed. We've sent a confirmation email with all the
              details.
            </p>
            <div className="rounded-xl border border-border bg-card p-6 text-left mb-8">
              <h3 className="font-semibold mb-4">Appointment Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Downtown Toyota - 123 Main St, Dallas, TX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{date?.toLocaleDateString()} at 2:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span>2025 Toyota RAV4 Hybrid</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/browse" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Browse More Models
                </Button>
              </Link>
              <Link href="/chat" className="flex-1">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Chat with Agent</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Toyota Agent</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Schedule Your Test Drive</h1>
            <p className="text-muted-foreground">Experience the 2025 RAV4 Hybrid in person</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="rounded-xl border border-border bg-card p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" required className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Dealership</Label>
                  <Select defaultValue="downtown">
                    <SelectTrigger id="location" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown">Downtown Toyota - 123 Main St</SelectItem>
                      <SelectItem value="north">North Dallas Toyota - 456 North Rd</SelectItem>
                      <SelectItem value="south">South Toyota Center - 789 South Ave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select defaultValue="afternoon">
                    <SelectTrigger id="time" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                      <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground">
                  Confirm Test Drive
                </Button>
              </form>
            </div>

            {/* Calendar & Info */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <Label className="mb-3 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-0"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Test drive duration: 30-45 minutes",
                    "No purchase obligation",
                    "Bring valid driver's license",
                    "Expert guide will answer questions",
                    "Experience all features and capabilities",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
