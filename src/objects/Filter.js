class Filter {
  constructor(name = "", weight = 0, negativeWeight = 0) {
    this._name = name;
    this._weight = weight;
    this._negativeWeight = negativeWeight;
  }

  checkMatch(term) {
    throw new Error("This function must be implemented");
  }

  name() {
    return this._name;
  }

  _score(score) {
    return {
      score,
      weight: (score === 0) ? this._negativeWeight : this._weight,
    };
  }
}

module.exports = Filter;
