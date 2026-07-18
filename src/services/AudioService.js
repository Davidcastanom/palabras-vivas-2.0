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
   * Play a single syllable via TTS
   */
  async playIndividualSyllable(syllable) {
    this.stopAll();
    await this.speak(syllable, { rate: 0.7 });
  }

  /**
   * Play correct answer feedback sound
   */
  async playCorrect() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  /**
   * Play wrong answer feedback sound
   */
  async playWrong() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  /**
   * Play celebration sound
   */
  async playCelebration() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.2);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.2);
    });
  }

  /**
   * Play trumpet fanfare MP3
   */
  async playTrumpet() {
    try {
      const audio = new Audio('https://res.cloudinary.com/dwhe4jadc/video/upload/v1784339664/pw23check-winning-218995_fkxxj5.mp3');
      audio.volume = 0.8;
      await audio.play();
    } catch (e) {
      this.playCelebration();
    }
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
