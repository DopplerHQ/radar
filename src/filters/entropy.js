const FilterWeights = require('../objects/filterweights');

const name = 'Entropy';
const weight = FilterWeights.VERYHIGH;
const negativeWeight = FilterWeights.VERYHIGH;

function returnObj(score) {
  return {
    score,
    weight: (score === 0) ? negativeWeight : weight,
  };
}

function checkMatch(term) {
  const entropy = calculateEntropy(term);
  if (entropy >= 5.5) return returnObj(1);
  if (entropy >= 4.7) return returnObj(.9);
  if (entropy >= 4) return returnObj(.8);
  if (entropy >= 3.75) return returnObj(.7);
  return returnObj(0);
}

function calculateEntropy(str) {
  const occurrences = {};
  str.split('').forEach((char) => {
    const count = (occurrences[char] || 0);
    occurrences[char] = count + 1;
  });

  const strLength = str.length;
  return Object.keys(occurrences).reduce((acc, char) => {
    const count = occurrences[char];
    const probability = (count / strLength)
    return (acc + (probability * Math.log2(1 / probability)));
  }, 0);
}

module.exports = { name, checkMatch, calculateEntropy };
