const Filter = require('../../src/filters/hex_notation');

test('hex notation', () => {
  expect(Filter.isMatch("0xab96")).toBe(true);
  expect(Filter.isMatch("0xAB96")).toBe(true);

  expect(Filter.isMatch("0x")).toBe(false);
  expect(Filter.isMatch("0xg")).toBe(false);
  expect(Filter.isMatch("0Xab96")).toBe(false);
});
