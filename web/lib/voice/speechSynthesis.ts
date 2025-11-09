/**
 * Browser-native Speech Synthesis wrapper
 * Handles text-to-speech with queue management for streaming responses
 */

export class SpeechSynthesisManager {
  private synthesis: SpeechSynthesis;
  private utteranceQueue: SpeechSynthesisUtterance[] = [];
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      // Create a dummy synthesis object for unsupported browsers
      this.synthesis = {
        speak: () => {},
        cancel: () => {},
        pause: () => {},
        resume: () => {},
        getVoices: () => [],
        onvoiceschanged: null,
      } as SpeechSynthesis;
      return;
    }

    this.synthesis = window.speechSynthesis;

    // Initialize voice (prefer a natural-sounding voice)
    this.initializeVoice();
  }

  private initializeVoice(): void {
    // Wait for voices to load
    const loadVoices = () => {
      const voices = this.synthesis.getVoices();
      
      // Prefer English voices, prioritize natural-sounding ones
      const preferredVoices = [
        "Google US English",
        "Microsoft Zira - English (United States)",
        "Samantha",
        "Alex",
      ];

      for (const preferredName of preferredVoices) {
        const voice = voices.find((v) => v.name.includes(preferredName));
        if (voice) {
          this.voice = voice;
          return;
        }
      }

      // Fallback to first English voice
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en") && v.localService
      );
      if (englishVoice) {
        this.voice = englishVoice;
      } else if (voices.length > 0) {
        this.voice = voices[0];
      }
    };

    if (this.synthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  public getSupported(): boolean {
    return typeof window !== "undefined" && !!window.speechSynthesis && this.synthesis !== null;
  }

  public getSpeaking(): boolean {
    return this.isSpeaking;
  }

  public speak(text: string, options?: { priority?: "high" | "normal" }): void {
    if (!this.getSupported()) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.voice) {
      utterance.voice = this.voice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = "en-US";

    // Handle high priority (interrupt current speech)
    if (options?.priority === "high") {
      this.cancel();
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.processQueue();
    };

    utterance.onerror = (event) => {
      console.error("[SpeechSynthesis] Error:", event);
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.processQueue();
    };

    if (this.isSpeaking) {
      // Add to queue
      this.utteranceQueue.push(utterance);
    } else {
      // Speak immediately
      this.currentUtterance = utterance;
      this.isSpeaking = true;
      this.synthesis.speak(utterance);
    }
  }

  private processQueue(): void {
    if (this.utteranceQueue.length > 0 && !this.isSpeaking) {
      const nextUtterance = this.utteranceQueue.shift();
      if (nextUtterance) {
        this.currentUtterance = nextUtterance;
        this.isSpeaking = true;
        this.synthesis.speak(nextUtterance);
      }
    }
  }

  public cancel(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.utteranceQueue = [];
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public pause(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.resume();
    }
  }
}

