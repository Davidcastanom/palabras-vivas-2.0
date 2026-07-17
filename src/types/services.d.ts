export interface AudioServiceInstance {
  playWordSequence(word: { word: string; syllables: string; img: string }): void;
  playSyllables(word: { syllables: string }): void;
  speak(text: string): void;
  stopAll(): void;
  isTTSAvailable(): boolean;
}

declare const audioService: AudioServiceInstance;
export default audioService;
