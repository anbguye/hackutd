"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { ToyotaFooter } from "@/components/layout/toyota-footer"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

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
      <div className="flex min-h-full flex-col bg-background text-foreground">
        <div className="border-b border-border/60 bg-background/80">
          <div className="toyota-container py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Step {step} of {totalSteps}
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-secondary">Let’s tailor your Toyota experience</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-muted-foreground md:block">
                  {Math.round((step / totalSteps) * 100)}% complete
                </span>
                <LogoutButton />
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-3xl rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-[0_28px_65px_-56px_rgba(15,20,26,0.85)] backdrop-blur md:p-12">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-secondary">Set your ceiling</h2>
                  <p className="text-base text-muted-foreground">
                    Toyota Agent shapes recommendations around the financial comfort zone you set.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/80 p-8 text-center">
                  <div className="text-4xl font-bold text-secondary">${budget[0].toLocaleString()}</div>
                  <p className="mt-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">Maximum budget</p>
                  <div className="mt-8 space-y-4">
                    <Slider value={budget} onValueChange={setBudget} min={15000} max={80000} step={1000} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$15,000</span>
                      <span>$80,000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <StepCard
                title="What type of Toyota body style suits you?"
                description="Tell us how you navigate life so we can prioritise the right silhouettes."
              >
                <RadioGroup defaultValue="suv" className="space-y-3">
                  {["Sedan", "SUV", "Truck", "Hybrid", "Any"].map((type) => (
                    <SelectableRow key={type} id={type.toLowerCase()} value={type.toLowerCase()} label={type} />
                  ))}
                </RadioGroup>
              </StepCard>
            )}

            {step === 3 && (
              <StepCard
                title="How many passengers ride with you most weeks?"
                description="We’ll use this to balance comfort, cargo, and Toyota Safety Sense coverage."
              >
                <RadioGroup defaultValue="5" className="space-y-3">
                  {[
                    { value: "2", label: "Just me or one passenger", desc: "Coupe or compact-friendly options" },
                    { value: "5", label: "Small family or friends", desc: "Toyota sedans and crossovers" },
                    { value: "7", label: "Large family or groups", desc: "SUVs and three-row leaders" },
                  ].map((option) => (
                    <SelectableRow
                      key={option.value}
                      id={option.value}
                      value={option.value}
                      label={option.label}
                      description={option.desc}
                      alignTop
                    />
                  ))}
                </RadioGroup>
              </StepCard>
            )}

            {step === 4 && (
              <StepCard
                title="What’s the primary use case?"
                description="We keep the experience adaptive—commuter calm, weekend adventure, or business-first."
              >
                <RadioGroup defaultValue="commute" className="space-y-3">
                  {[
                    { value: "commute", label: "Daily commute", desc: "Efficiency, comfort, and driver-assist focus" },
                    { value: "family", label: "Family trips", desc: "Space, versatility, and safety at the core" },
                    { value: "adventure", label: "Adventure", desc: "Capability, ground clearance, and AWD" },
                    { value: "business", label: "Business", desc: "Refinement, tech, and executive presence" },
                  ].map((option) => (
                    <SelectableRow
                      key={option.value}
                      id={option.value}
                      value={option.value}
                      label={option.label}
                      description={option.desc}
                      alignTop
                    />
                  ))}
                </RadioGroup>
              </StepCard>
            )}

            {step === 5 && (
              <StepCard
                title="How critical is fuel efficiency?"
                description="Toyota Agent blends hybrid, plug-in, and gasoline options based on your stance."
              >
                <RadioGroup defaultValue="important" className="space-y-3">
                  {[
                    { value: "critical", label: "Critical", desc: "Hybrid or max MPG required" },
                    { value: "important", label: "Important", desc: "Prefer efficiency but open to balance" },
                    { value: "neutral", label: "Neutral", desc: "Performance or utility takes priority" },
                  ].map((option) => (
                    <SelectableRow
                      key={option.value}
                      id={option.value}
                      value={option.value}
                      label={option.label}
                      description={option.desc}
                      alignTop
                    />
                  ))}
                </RadioGroup>
              </StepCard>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="rounded-full border-border/70 px-6 font-semibold hover:border-primary/60 hover:text-primary"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="rounded-full px-7 font-semibold shadow-[0_24px_48px_-32px_rgba(235,10,30,0.6)]"
              >
                {step === totalSteps ? "Start chatting" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <ToyotaFooter />
      </div>
    </RequireAuth>
  )
}

type StepCardProps = {
  title: string
  description: string
  children: ReactNode
}

function StepCard({ title, description, children }: StepCardProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-secondary">{title}</h2>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

type SelectableRowProps = {
  id: string
  value: string
  label: string
  description?: string
  alignTop?: boolean
}

function SelectableRow({ id, value, label, description, alignTop = false }: SelectableRowProps) {
  return (
    <div className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-background/60 px-5 py-4 transition-all hover:border-primary/60 hover:bg-primary/10">
      <RadioGroupItem value={value} id={id} className={alignTop ? "mt-1.5" : ""} />
      <div>
        <Label htmlFor={id} className="cursor-pointer text-base font-semibold text-secondary">
          {label}
        </Label>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}
