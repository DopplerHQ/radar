const { checkMatch } = require('../../src/filters/mixedchars');

test('are mixed', () => {
  expect(checkMatch("abc123")).toHaveProperty("score", 1);
  expect(checkMatch("ABC123")).toHaveProperty("score", 1);
  expect(checkMatch("Aa1")).toHaveProperty("score", 1);
});

test('are not mixed', () => {
  expect(checkMatch("abc")).toHaveProperty("score", 0);
  expect(checkMatch("ABC")).toHaveProperty("score", 0);
  expect(checkMatch("abcABC")).toHaveProperty("score", 0);
  expect(checkMatch("123")).toHaveProperty("score", 0);
});
