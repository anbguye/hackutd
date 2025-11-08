"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Car, ChevronLeft, ChevronRight } from "lucide-react"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { LogoutButton } from "@/components/auth/LogoutButton"

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [budget, setBudget] = useState([35000])

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      router.push("/chat")
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <RequireAuth>
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
            <div className="ml-auto">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-8 lg:p-12 shadow-lg">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">What's your budget?</h2>
                  <p className="text-muted-foreground">This helps us show you the right Toyota models</p>
                </div>
                <div className="space-y-6 py-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">${budget[0].toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Maximum budget</p>
                  </div>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={15000}
                    max={80000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$15,000</span>
                    <span>$80,000</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">What type of vehicle?</h2>
                  <p className="text-muted-foreground">Choose the style that fits your lifestyle</p>
                </div>
                <RadioGroup defaultValue="suv" className="space-y-3">
                  {["Sedan", "SUV", "Truck", "Hybrid", "Any"].map((type) => (
                    <div
                      key={type}
                      className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={type.toLowerCase()} id={type.toLowerCase()} />
                      <Label htmlFor={type.toLowerCase()} className="flex-1 cursor-pointer font-medium">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">How many passengers?</h2>
                  <p className="text-muted-foreground">Consider your typical usage</p>
                </div>
                <RadioGroup defaultValue="5" className="space-y-3">
                  {[
                    { value: "2", label: "2 seats", desc: "Just me or one passenger" },
                    { value: "5", label: "5 seats", desc: "Small family or friends" },
                    { value: "7", label: "7+ seats", desc: "Large family or groups" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="cursor-pointer font-medium block mb-1">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Primary use case?</h2>
                  <p className="text-muted-foreground">How will you use this vehicle most?</p>
                </div>
                <RadioGroup defaultValue="commute" className="space-y-3">
                  {[
                    { value: "commute", label: "Daily Commute", desc: "City driving and work trips" },
                    { value: "family", label: "Family Trips", desc: "Weekend outings and errands" },
                    { value: "adventure", label: "Adventure", desc: "Off-road and outdoor activities" },
                    { value: "business", label: "Business", desc: "Professional and client meetings" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="cursor-pointer font-medium block mb-1">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Fuel efficiency priority?</h2>
                  <p className="text-muted-foreground">How important is MPG to you?</p>
                </div>
                <RadioGroup defaultValue="important" className="space-y-3">
                  {[
                    { value: "critical", label: "Critical", desc: "Hybrid or best MPG only" },
                    { value: "important", label: "Important", desc: "Good MPG preferred" },
                    { value: "neutral", label: "Neutral", desc: "Not a major factor" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="cursor-pointer font-medium block mb-1">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {step === totalSteps ? "Start Chatting" : "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </RequireAuth>
  )
}
