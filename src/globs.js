// const micromatch = require('picomatch');
const micromatch = require('micromatch');

const MicroMatchOptions = {
  nocase: true,
  dot: true,
};

const isMatch = (text, pattern) => micromatch.isMatch(text, pattern, MicroMatchOptions);

module.exports = { isMatch };
