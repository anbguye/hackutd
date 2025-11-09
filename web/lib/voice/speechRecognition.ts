/**
 * Browser-native Speech Recognition wrapper
 * Handles webkitSpeechRecognition compatibility and state management
 */

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export type SpeechRecognitionCallbacks = {
  onResult: (text: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
  onSilence?: () => void; // Called when silence detected (for auto-stop)
};

export class SpeechRecognitionManager {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.isSupported = false;
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // Continuous listening for true voice mode
      this.recognition.interimResults = true; // Get interim results for streaming
      this.recognition.lang = "en-US";
      this.isSupported = true;
    } catch (error) {
      console.error("[SpeechRecognition] Failed to initialize:", error);
      this.isSupported = false;
    }
  }

  public getSupported(): boolean {
    return this.isSupported;
  }

  public getListening(): boolean {
    return this.isListening;
  }

  public start(callbacks: SpeechRecognitionCallbacks): void {
    if (!this.isSupported || !this.recognition) {
      callbacks.onError("Speech recognition is not supported in this browser");
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStart();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        callbacks.onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        callbacks.onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.isListening = false;
      let errorMessage = "Speech recognition error";

      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try again.";
          break;
        case "audio-capture":
          errorMessage = "Microphone not found. Please check your microphone.";
          break;
        case "not-allowed":
          errorMessage =
            "Microphone permission denied. Please enable microphone access.";
          break;
        case "network":
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      callbacks.onError(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd();
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.isListening = false;
      callbacks.onError("Failed to start speech recognition");
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        // Ignore errors when stopping
      }
      this.isListening = false;
    }
  }

  public abort(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch (error) {
        // Ignore errors when aborting
      }
      this.isListening = false;
    }
  }
}

