const name = 'Entropy';
const weight = 5;
const negativeWeight = 5;

function matchScore(term) {
  const entropy = measureEntropy(term);
  // console.log(entropy);
  if (entropy >= 4.5) return 1;
  if (entropy >= 4) return .8;
  if (entropy >= 3.75) return .6;
  return 0;
}

// from https://gist.github.com/ppseprus/afab8500dec6394c401734cb6922d220
function measureEntropy(str) {
  return [...new Set(str)]
    .map((char) => {
      const regex = escapeRegex(char);
      return str.match(new RegExp(regex, 'g')).length;
    })
    .reduce((sum, frequency) => {
      const p = (frequency / str.length);
      return sum + (p * Math.log2(1 / p));
    }, 0);
}

// from https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
function escapeRegex(text) {
  const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;
  return text.replace(matchOperatorsRegex, '\\$&');
}

module.exports = { name, weight, negativeWeight, matchScore };
