const picomatch = require('picomatch');

const MatchOptions = {
  nocase: true,
  dot: true,
  lookbehinds: false,
  nobrace: true,
  noextglob: true,
  nonegate: true,
  noquantifiers: true,
  strictBrackets: true,
};

const isMatch = (text, pattern) => picomatch.isMatch(text, pattern, MatchOptions);

module.exports = { isMatch };
