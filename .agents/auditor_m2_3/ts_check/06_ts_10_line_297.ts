export interface AudioPlayerBlockContent {
  url: string; // Local audio file URI (.m4a, .mp3, .wav)
  duration: number; // Duration in seconds
  transcript?: string | null; // Whisper STT transcribed text payload
  playbackSpeed?: number; // Default 1.0 (supports 1.0, 1.25, 1.5, 2.0)
}
