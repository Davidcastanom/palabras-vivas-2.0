/**
 * BaseGame Class
 * Clase base para todos los juegos de Palabras Vivas
 */

class BaseGame {
  /**
   * @param {Object} config
   * @param {string} config.id - ID del juego
   * @param {string} config.category - Categoría del juego
   * @param {Array} config.words - Palabras del juego
   * @param {number} config.totalRounds - Total de rondas
   * @param {Function} config.onStateChange - Callback de cambio de estado
   * @param {Function} config.onGameComplete - Callback de juego completado
   * @param {Function} config.onCorrectAnswer - Callback de respuesta correcta
   * @param {Function} config.onWrongAnswer - Callback de respuesta incorrecta
   */
  constructor(config = {}) {
    this.config = {
      id: null,
      category: null,
      words: [],
      totalRounds: 5,
      onStateChange: null,
      onGameComplete: null,
      onCorrectAnswer: null,
      onWrongAnswer: null,
      ...config
    };

    this.state = {
      currentRound: 1,
      currentWord: null,
      score: 0,
      streak: 0,
      bestStreak: 0,
      mistakes: 0,
      isComplete: false,
      isPaused: false,
      timeElapsed: 0,
      wordsCompleted: [],
      wordsRemaining: []
    };

    this.timer = null;
    this.startTime = null;
  }

  /**
   * Inicializar el juego
   */
  init() {
    // Mezclar palabras
    this.state.wordsRemaining = this.shuffleArray([...this.config.words]);
    this.state.wordsCompleted = [];
    this.state.currentRound = 1;
    this.state.score = 0;
    this.state.streak = 0;
    this.state.bestStreak = 0;
    this.state.mistakes = 0;
    this.state.isComplete = false;
    this.state.timeElapsed = 0;

    // Seleccionar primera palabra
    this.state.currentWord = this.state.wordsRemaining.pop();

    // Iniciar temporizador
    this.startTimer();

    // Notificar cambio de estado
    this.notifyStateChange();

    return this.state;
  }

  /**
   * Verificar respuesta
   * @param {string} answer - Respuesta del usuario
   * @returns {boolean} - Si es correcta
   */
  checkAnswer(answer) {
    if (this.state.isComplete || this.state.isPaused) return false;

    const isCorrect = this.normalizeString(answer) === this.normalizeString(this.state.currentWord.word);

    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }

    return isCorrect;
  }

  /**
   * Manejar respuesta correcta
   */
  handleCorrectAnswer() {
    // Calcular puntos
    const basePoints = 10;
    const streakBonus = this.state.streak * 2;
    const points = basePoints + streakBonus;

    // Actualizar estado
    this.state.score += points;
    this.state.streak++;
    this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);
    this.state.wordsCompleted.push(this.state.currentWord);

    // Notificar
    if (this.config.onCorrectAnswer) {
      this.config.onCorrectAnswer({
        word: this.state.currentWord,
        points,
        streak: this.state.streak
      });
    }

    this.notifyStateChange();
  }

  /**
   * Manejar respuesta incorrecta
   */
  handleWrongAnswer() {
    this.state.streak = 0;
    this.state.mistakes++;

    // Notificar
    if (this.config.onWrongAnswer) {
      this.config.onWrongAnswer({
        word: this.state.currentWord,
        mistakes: this.state.mistakes
      });
    }

    this.notifyStateChange();
  }

  /**
   * Avanzar a siguiente ronda
   */
  nextRound() {
    if (this.state.wordsRemaining.length === 0) {
      this.completeGame();
      return;
    }

    this.state.currentRound++;
    this.state.currentWord = this.state.wordsRemaining.pop();
    this.notifyStateChange();
  }

  /**
   * Completar juego
   */
  completeGame() {
    this.state.isComplete = true;
    this.stopTimer();

    const result = this.calculateResult();

    if (this.config.onGameComplete) {
      this.config.onGameComplete(result);
    }

    this.notifyStateChange();
  }

  /**
   * Calcular resultado final
   */
  calculateResult() {
    const accuracy = this.state.wordsCompleted.length > 0
      ? Math.round((this.state.wordsCompleted.length / this.config.totalRounds) * 100)
      : 0;

    const stars = this.calculateStars(accuracy);

    return {
      gameId: this.config.id,
      category: this.config.category,
      score: this.state.score,
      accuracy,
      stars,
      streak: this.state.bestStreak,
      mistakes: this.state.mistakes,
      timeElapsed: this.state.timeElapsed,
      wordsCompleted: this.state.wordsCompleted.length,
      totalWords: this.config.totalRounds
    };
  }

  /**
   * Calificar con estrellas
   */
  calculateStars(accuracy) {
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    if (accuracy >= 50) return 1;
    return 0;
  }

  /**
   * Pausar juego
   */
  pause() {
    this.state.isPaused = true;
    this.stopTimer();
    this.notifyStateChange();
  }

  /**
   * Reanudar juego
   */
  resume() {
    this.state.isPaused = false;
    this.startTimer();
    this.notifyStateChange();
  }

  /**
   * Reiniciar juego
   */
  reset() {
    this.stopTimer();
    this.init();
  }

  /**
   * Iniciar temporizador
   */
  startTimer() {
    this.startTime = Date.now() - (this.state.timeElapsed * 1000);
    this.timer = setInterval(() => {
      this.state.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.notifyStateChange();
    }, 1000);
  }

  /**
   * Detener temporizador
   */
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Notificar cambio de estado
   */
  notifyStateChange() {
    if (this.config.onStateChange) {
      this.config.onStateChange({ ...this.state });
    }
  }

  /**
   * Normalizar string para comparación
   */
  normalizeString(str) {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /**
   * Mezclar array (Fisher-Yates)
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Obtener estado actual
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Obtener progreso
   */
  getProgress() {
    return {
      current: this.state.currentRound,
      total: this.config.totalRounds,
      percentage: Math.round((this.state.currentRound / this.config.totalRounds) * 100)
    };
  }

  /**
   * Destruir juego
   */
  destroy() {
    this.stopTimer();
    this.config.onStateChange = null;
    this.config.onGameComplete = null;
    this.config.onCorrectAnswer = null;
    this.config.onWrongAnswer = null;
  }
}

export default BaseGame;
