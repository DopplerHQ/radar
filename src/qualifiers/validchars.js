const name = 'Valid characters';
const weight = 1;
const negativeWeight = 10;

function matchScore(term) {
  const isValid = isCharactersValid(term);
  return isValid ? 1 : 0;
}

function isCharactersValid(text) {
  for (let i = 0; i < text.length; ++i) {
    const charCode = text[i].charCodeAt(0);
    const isValid = (charCode >= 33) && (charCode <= 126);
    if (!isValid) {
      return false;
    }
  }
  return true;
}

module.exports = { name, weight, negativeWeight, matchScore };
