const { checkMatch } = require('../../src/filters/length');

test('lengths', () => {
  expect(checkMatch("abcdefghijklmnopqrstuvwxyz012345")).toHaveProperty("score", 1);
  expect(checkMatch("abcdefghijklmnopqrstuvwx")).toHaveProperty("score", .85);
  expect(checkMatch("abcdefghijklmno")).toHaveProperty("score", .7);
  expect(checkMatch("abcdefghijklmn")).toHaveProperty("score", 0);
  expect(checkMatch("abc")).toHaveProperty("score", 0);
});
