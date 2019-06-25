const { checkMatch } = require('../../src/filters/mixedchars');

test('are mixed', () => {
  expect(checkMatch("abc123")).toStrictEqual(1);
  expect(checkMatch("ABC123")).toStrictEqual(1);
  expect(checkMatch("Aa1")).toStrictEqual(1);
});

test('are not mixed', () => {
  expect(checkMatch("abc")).toStrictEqual(0);
  expect(checkMatch("ABC")).toStrictEqual(0);
  expect(checkMatch("abcABC")).toStrictEqual(0);
  expect(checkMatch("123")).toStrictEqual(0);
});
