const picomatch = require('picomatch');

const MatchOptions = {
  nocase: true,
  dot: true,
};

const isMatch = (text, pattern) => picomatch.isMatch(text, pattern, MatchOptions);

module.exports = { isMatch };
