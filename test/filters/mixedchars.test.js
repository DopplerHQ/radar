const { checkMatch } = require('../../src/filters/mixedchars');

test('are mixed', () => {
  expect(checkMatch("abc123")).toBe(1);
  expect(checkMatch("ABC123")).toBe(1);
  expect(checkMatch("Aa1")).toBe(1);
});

test('are not mixed', () => {
  expect(checkMatch("abc")).toBe(0);
  expect(checkMatch("ABC")).toBe(0);
  expect(checkMatch("abcABC")).toBe(0);
  expect(checkMatch("123")).toBe(0);
});
