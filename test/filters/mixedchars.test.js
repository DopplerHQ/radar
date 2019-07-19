const Filter = require('../../src/filters/mixedchars');

test('are mixed', () => {
  expect(Filter.checkMatch("abc123")).toBe(true);
  expect(Filter.checkMatch("ABC123")).toBe(true);
  expect(Filter.checkMatch("Aa1")).toBe(true);
});

test('are not mixed', () => {
  expect(Filter.checkMatch("abc")).toBe(false);
  expect(Filter.checkMatch("ABC")).toBe(false);
  expect(Filter.checkMatch("abcABC")).toBe(false);
  expect(Filter.checkMatch("123")).toBe(false);
});
