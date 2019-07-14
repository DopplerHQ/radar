const Filter = require('../../src/filters/length');

test('lengths', () => {
  expect(Filter.checkMatch("abcdefghijklmnopqrstuvwxyz012345")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("abcdefghijklmnopqrstuvwx")).toHaveProperty("score", .85);
  expect(Filter.checkMatch("abcdefghijklmno")).toHaveProperty("score", .7);
  expect(Filter.checkMatch("abcdefghijklmn")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("abc")).toHaveProperty("score", 0);
});
