const Filter = require('../../src/filters/mixedchars');

test('are mixed', () => {
  expect(Filter.isMatch("abc123")).toBe(true);
  expect(Filter.isMatch("ABC123")).toBe(true);
  expect(Filter.isMatch("Aa1")).toBe(true);
  expect(Filter.isMatch("STRIPE_API_KEY=123456d781fdf0dfdf323434cvfdfgyddf")).toBe(true);
});

test('are not mixed', () => {
  expect(Filter.isMatch(",!0)},{101:101,102:102,103:103,104:104,107:107,108:108,116:116,118:118,124:124,126:126,140:140,143:143,147:147,150:150,151:151,152:152,38:")).toBe(false);
  expect(Filter.isMatch("abc")).toBe(false);
  expect(Filter.isMatch("ABC")).toBe(false);
  expect(Filter.isMatch("abcABC")).toBe(false);
  expect(Filter.isMatch("123")).toBe(false);
  expect(Filter.isMatch("123-124#@$%*&@^%,./><?\\|}|")).toBe(false);
});
