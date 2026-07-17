/**
 * AudioService - Palabras Vivas 2.0
 * Handles audio playback with MP3 + TTS fallback
 */

import { audioBaseUrl as BASE_AUDIO_URL } from '../data/words.js';

class AudioService {
  constructor() {
    this.currentAudio = [];
    this.currentTimeouts = [];
  }

  /**
   * Stop all audio playback
   */
  stopAll() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.currentAudio.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_e) { /* ignore */ }
    });
    this.currentAudio = [];

    this.currentTimeouts.forEach(id => clearTimeout(id));
    this.currentTimeouts = [];
  }

  /**
   * Play word audio sequence:
   * 1. Word pronunciation (MP3 or TTS)
   * 2. Syllable audio (MP3 or TTS)
   * 3. Sound effect
   */
  async playWordSequence(wordData) {
    this.stopAll();

    const { word, syllables, audio, syllableAudio, sound } = wordData;

    // 1. Play word
    await this.playMP3OrTTS(audio, word);

    // 2. Play syllables after pause
    await this.delay(500);
    if (syllableAudio) {
      await this.playMP3OrTTS(syllableAudio, this.syllablesToTTS(syllables));
    } else {
      await this.speak(this.syllablesToTTS(syllables));
    }

    // 3. Play sound effect after pause
    await this.delay(500);
    if (sound) {
      this.playMP3(sound, 0.6).catch(() => {});
    }
  }

  /**
   * Play a single word (for replay button)
   */
  async playWord(wordData) {
    this.stopAll();
    const { word, audio } = wordData;
    await this.playMP3OrTTS(audio, word);
  }

  /**
   * Play syllable audio
   */
  async playSyllables(wordData) {
    this.stopAll();
    const { syllables, syllableAudio } = wordData;
    if (syllableAudio) {
      await this.playMP3OrTTS(syllableAudio, this.syllablesToTTS(syllables));
    } else {
      await this.speak(this.syllablesToTTS(syllables));
    }
  }

  /**
   * Play sound effect
   */
  async playSound(wordData) {
    this.stopAll();
    if (wordData.sound) {
      this.playMP3(wordData.sound, 0.6).catch(() => {});
    }
  }

  /**
   * Play MP3 file, fallback to TTS
   */
  playMP3OrTTS(filename, fallbackText) {
    return new Promise((resolve) => {
      const audio = new Audio(`${BASE_AUDIO_URL}/${filename}`);
      this.currentAudio.push(audio);
      
      audio.onended = resolve;
      audio.onerror = () => {
        this.speak(fallbackText).then(resolve);
      };
      
      audio.play().catch(() => {
        this.speak(fallbackText).then(resolve);
      });
    });
  }

  /**
   * Play MP3 file
   */
  playMP3(filename, volume = 1) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(`${BASE_AUDIO_URL}/${filename}`);
      audio.volume = volume;
      this.currentAudio.push(audio);
      
      audio.onended = resolve;
      audio.onerror = reject;
      
      audio.play().catch(reject);
    });
  }

  /**
   * TTS using Web Speech API
   */
  speak(text, options = {}) {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang || 'es-MX';
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1;
        utterance.onend = resolve;
        utterance.onerror = resolve;
        window.speechSynthesis.speak(utterance);
        // Fallback timeout in case onend doesn't fire
        setTimeout(resolve, 2000);
      } else {
        resolve();
      }
    });
  }

  /**
   * Convert syllables string to TTS-friendly format
   * 'Pe-rro' -> 'Pe ... rro'
   */
  syllablesToTTS(syllables) {
    if (typeof syllables === 'string') {
      return syllables.replace(/-/g, ' ... ');
    }
    return syllables.join(' ... ');
  }

  /**
   * Utility delay
   */
  delay(ms) {
    return new Promise((resolve) => {
      const id = setTimeout(resolve, ms);
      this.currentTimeouts.push(id);
    });
  }
}

export const audioService = new AudioService();
export default audioService;
