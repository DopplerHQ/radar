const name = 'Entropy';
const weight = 5;
const negativeWeight = 5;

function checkMatch(term) {
  const entropy = calculateEntropy(term);
  if (entropy >= 5.5) return 1;
  if (entropy >= 4.7) return .9;
  if (entropy >= 4) return .8;
  if (entropy >= 3.75) return .7;
  return 0;
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

module.exports = { name, weight, negativeWeight, checkMatch, calculateEntropy };
