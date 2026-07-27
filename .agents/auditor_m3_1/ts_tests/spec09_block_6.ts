export interface SpeechChunk {
  blockId: string;
  text: string;
  charOffset: number;
}

export interface TTSPlaybackState {
  status: 'IDLE' | 'PLAYING' | 'PAUSED' | 'STOPPED';
  currentBlockId: string | null;
  currentWordIndex: number;
  rate: number; // 0.5x, 1.0x, 1.25x, 1.5x, 2.0x
  voiceUri: string | null;
}