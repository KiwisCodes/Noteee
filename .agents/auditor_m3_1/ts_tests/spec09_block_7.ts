import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export async function configureAudioSession(): Promise<void> {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}

export function playNoteTTS(
  chunks: SpeechChunk[],
  onBlockChange: (blockId: string) => void
): void {
  let index = 0;

  function speakNext() {
    if (index >= chunks.length) return;

    const chunk = chunks[index];
    onBlockChange(chunk.blockId);

    Speech.speak(chunk.text, {
      rate: 1.0,
      onDone: () => {
        index++;
        speakNext();
      },
      onError: (err) => console.error('TTS playback error:', err),
    });
  }

  speakNext();
}