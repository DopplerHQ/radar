const { checkMatch } = require('../../src/filters/length');

test('lengths', () => {
  expect(checkMatch("abcdefghijklmnopqrstuvwxyz012345")).toStrictEqual(1);
  expect(checkMatch("abcdefghijklmnopqrstuvwx")).toStrictEqual(.85);
  expect(checkMatch("abcdefghijklmno")).toStrictEqual(.7);
  expect(checkMatch("abcdefghijklmn")).toStrictEqual(0);
  expect(checkMatch("abc")).toStrictEqual(0);
});
