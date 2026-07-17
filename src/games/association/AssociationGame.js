import BaseGame from '../base/BaseGame.js';

class AssociationGame extends BaseGame {
  constructor(config = {}) {
    super({
      id: 'association',
      totalRounds: 5,
      ...config
    });

    this.currentOptions = [];
    this.currentTarget = null;
    this.correctCount = 0;
  }

  init() {
    this.state.currentRound = 0;
    this.state.score = 0;
    this.state.streak = 0;
    this.state.isComplete = false;
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
    const isCorrect = selectedOption.id === this.currentTarget.id;

    if (isCorrect) {
      this.correctCount++;
      this.state.score += 10 + this.state.streak * 2;
      this.state.streak++;
      this.state.currentRound++;
      this.handleCorrectAnswer({ word: this.currentTarget, points: 10 + (this.state.streak - 1) * 2 });

      if (this.state.currentRound >= this.config.totalRounds) {
        this.completeGame();
      } else {
        this.generateRound();
      }
    } else {
      this.state.streak = 0;
      this.handleWrongAnswer({ word: this.currentTarget });
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

export default AssociationGame;
