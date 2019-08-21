const progress = require('cli-progress');

class ProgressBar {
  constructor() {
    this.bar = new progress.Bar({
      stopOnComplete: true,
      clearOnComplete: true,
      etaBuffer: 1000,
    }, progress.Presets.shades_classic);
  }

  init(num) {
    this.bar.start(num, 0);
  }

  increment() {
    this.bar.increment();
  }
}

module.exports = ProgressBar;
