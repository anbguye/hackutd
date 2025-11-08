"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Car, Send, User, Bot } from "lucide-react"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { LogoutButton } from "@/components/auth/LogoutButton"

type Message = {
  role: "user" | "agent"
  content: string
  suggestions?: string[]
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content:
        "Hi! I'm your Toyota shopping companion. Based on your preferences, I found some excellent matches for you. You're looking for an SUV around $35,000 for daily commutes with good fuel efficiency, right?",
      suggestions: ["Yes, that's right", "I want to adjust my budget", "Show me the options"],
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
      {
        role: "agent",
        content:
          "Great! Based on what you've told me, I recommend the 2025 Toyota RAV4 Hybrid. It's perfect for daily commuting with an impressive 41 MPG city, seats 5 comfortably, and falls within your budget at $36,000. Would you like to see a detailed breakdown of total costs including insurance and financing?",
        suggestions: ["Show me total costs", "Compare with other models", "Schedule a test drive"],
      },
    ]
    setMessages(newMessages)
    setInput("")
  }

  return (
    <RequireAuth>
      <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Toyota Agent</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/browse">
                <Button variant="outline" size="sm">
                  Browse All
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" size="sm">
                  Compare
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 h-full max-w-4xl py-6">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {messages.map((message, i) => (
                <div key={i} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "agent" && (
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-accent-foreground" />
                    </div>
                  )}
                  <div
                    className={`flex flex-col gap-3 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`rounded-2xl px-5 py-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, j) => (
                          <Button
                            key={j}
                            variant="outline"
                            size="sm"
                            className="text-xs bg-transparent"
                            onClick={() => setInput(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background">
        <div className="container mx-auto px-6 lg:px-8 py-4 max-w-4xl">
          <div className="flex gap-3">
            <Input
              placeholder="Ask about Toyota models, pricing, features..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="h-11 flex-1"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="h-11 w-11 bg-accent hover:bg-accent/90 text-accent-foreground flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Ask anything about Toyota vehicles, features, or pricing
          </p>
        </div>
      </div>
      </div>
    </RequireAuth>
  )
}
