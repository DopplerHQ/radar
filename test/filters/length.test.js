const { checkMatch } = require('../../src/filters/length');

test('lengths', () => {
  expect(checkMatch("abcdefghijklmnopqrstuvwxyz012345")).toBe(1);
  expect(checkMatch("abcdefghijklmnopqrstuvwx")).toBe(.85);
  expect(checkMatch("abcdefghijklmno")).toBe(.7);
  expect(checkMatch("abcdefghijklmn")).toBe(0);
  expect(checkMatch("abc")).toBe(0);
});
