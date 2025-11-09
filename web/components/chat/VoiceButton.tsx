"use client";

import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  onClick: () => void;
  className?: string;
}

export function VoiceButton({
  isListening,
  isProcessing,
  isSpeaking,
  isSupported,
  onClick,
  className,
}: VoiceButtonProps) {
  if (!isSupported) {
    return null;
  }

  const getIcon = () => {
    if (isProcessing) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    if (isListening) {
      return <Mic className="h-5 w-5" />;
    }
    return <MicOff className="h-5 w-5" />;
  };

  const getButtonStyles = () => {
    if (isListening) {
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90 animate-pulse";
    }
    if (isSpeaking) {
      return "bg-primary/80 text-primary-foreground hover:bg-primary/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/80";
  };

  return (
    <Button
      type="button"
      size="icon"
      onClick={onClick}
      disabled={isProcessing}
      className={cn(
        "h-12 w-12 rounded-full transition-all",
        getButtonStyles(),
        className
      )}
      aria-label={isListening ? "Stop listening" : "Start voice input"}
    >
      {getIcon()}
    </Button>
  );
}

