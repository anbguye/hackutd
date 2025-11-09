/**
 * Web Audio API-based silence detection
 * Monitors audio levels in real-time and detects silence periods
 */

export class SilenceDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private silenceStartTime: number | null = null;
  private isMonitoring: boolean = false;

  private readonly SILENCE_THRESHOLD = -50; // dB threshold for silence (lower = more sensitive)
  private readonly SILENCE_DURATION = 2000; // 2 seconds of silence
  private readonly CHECK_INTERVAL = 100; // Check every 100ms

  constructor(
    private onSilenceDetected: () => void,
    private onAudioDetected?: () => void
  ) {}

  public async start(): Promise<void> {
    try {
      // Get microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Create audio context
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect microphone to analyser
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);

      this.isMonitoring = true;
      this.silenceStartTime = null;
      this.monitorAudioLevels();
    } catch (error) {
      console.error("[SilenceDetector] Failed to start:", error);
      throw new Error("Failed to access microphone for silence detection");
    }
  }

  public stop(): void {
    this.isMonitoring = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.silenceStartTime = null;
  }

  private monitorAudioLevels(): void {
    if (!this.isMonitoring || !this.analyser) {
      return;
    }

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    // Convert to dB: 0-255 range, where 0 = -Infinity dB, 255 = 0 dB
    const volumeDb = average > 0 ? 20 * Math.log10(average / 255) : -Infinity;

    // Check if volume is below silence threshold
    const isSilent = volumeDb < this.SILENCE_THRESHOLD || average < 10;

    if (isSilent) {
      // Silence detected
      if (this.silenceStartTime === null) {
        this.silenceStartTime = Date.now();
      } else {
        const silenceDuration = Date.now() - this.silenceStartTime;
        if (silenceDuration >= this.SILENCE_DURATION) {
          // Silence detected for required duration
          this.onSilenceDetected();
          this.silenceStartTime = null;
        }
      }
    } else {
      // Audio detected - reset silence timer
      if (this.silenceStartTime !== null) {
        this.silenceStartTime = null;
        if (this.onAudioDetected) {
          this.onAudioDetected();
        }
      }
    }

    // Continue monitoring
    this.animationFrameId = requestAnimationFrame(() => {
      setTimeout(() => this.monitorAudioLevels(), this.CHECK_INTERVAL);
    });
  }

  public getSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia &&
      !!window.AudioContext
    );
  }
}

