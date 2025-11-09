"use client";

import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-4 justify-start">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex max-w-[82%] flex-col gap-3 items-start">
        <div className="rounded-3xl border border-border/70 bg-background/90 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Typing</span>
            <div className="flex gap-1 items-center">
              <span
                className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
                style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
              />
              <span
                className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
                style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
              />
              <span
                className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
                style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

