const Filter = require('../../src/filters/mixedchars');

test('are mixed', () => {
  expect(Filter.checkMatch("abc123")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("ABC123")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("Aa1")).toHaveProperty("score", 1);
});

test('are not mixed', () => {
  expect(Filter.checkMatch("abc")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("ABC")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("abcABC")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("123")).toHaveProperty("score", 0);
});
