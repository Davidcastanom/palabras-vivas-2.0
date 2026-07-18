import BaseGame from '../base/BaseGame.js';

class CompleteWordGame extends BaseGame {
  constructor(config = {}) {
    super({
      id: 'complete-word',
      totalRounds: 5,
      ...config
    });

    this.currentOptions = [];
    this.currentTarget = null;
    this.correctCount = 0;
  }

  init() {
    super.init();
    this.state.currentRound = 0;
    this.correctCount = 0;
    this.generateRound();
    return this.state;
  }

  generateRound() {
    const allWords = this.config.words;
    const targetIndex = Math.floor(Math.random() * allWords.length);
    this.currentTarget = allWords[targetIndex];

    let distractors = allWords.filter(w => w.id !== this.currentTarget.id);
    const numDistractors = Math.min(2, distractors.length);
    distractors = this.shuffleArray([...distractors]).slice(0, numDistractors);

    this.currentOptions = this.shuffleArray([this.currentTarget, ...distractors]);
    this.notifyStateChange();
  }

  checkAnswer(selectedOption) {
    if (this.state.isComplete) return false;

    const isCorrect = selectedOption.id === this.currentTarget.id;

    if (isCorrect) {
      this.correctCount++;
      this.state.currentRound++;

      this.config.onCorrectAnswer?.({
        word: this.currentTarget,
        points: 10 + this.state.streak * 2,
        streak: this.state.streak + 1
      });

      this.state.score += 10 + this.state.streak * 2;
      this.state.streak++;
      this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);
      this.state.wordsCompleted.push(this.currentTarget);
      this.notifyStateChange();

      if (this.state.currentRound >= this.config.totalRounds) {
        this.completeGame();
      } else {
        this.generateRound();
      }
    } else {
      this.state.streak = 0;
      this.state.mistakes++;

      this.config.onWrongAnswer?.({
        word: this.currentTarget,
        mistakes: this.state.mistakes
      });

      this.notifyStateChange();
    }

    return isCorrect;
  }

  getOptions() {
    return this.currentOptions;
  }

  getTarget() {
    return this.currentTarget;
  }

  reset() {
    this.correctCount = 0;
    this.state.currentRound = 0;
    this.state.score = 0;
    this.state.streak = 0;
    this.state.isComplete = false;
    this.generateRound();
  }
}

export default CompleteWordGame;
