const { checkMatch } = require('../../src/filters/excludepaths');

test('paths', () => {
  expect(checkMatch("/root/test/path")).toStrictEqual(0);
  expect(checkMatch("/root/test/path/")).toStrictEqual(0);
  expect(checkMatch("/root/test.txt")).toStrictEqual(0);
  expect(checkMatch("./test")).toStrictEqual(0);
  expect(checkMatch("../test")).toStrictEqual(0);
  expect(checkMatch("////root")).toStrictEqual(0);
});

test('not paths', () => {
  expect(checkMatch("test")).toStrictEqual(1);
  expect(checkMatch("test.txt")).toStrictEqual(1);
  expect(checkMatch(".test.txt")).toStrictEqual(1);
  expect(checkMatch("test/test")).toStrictEqual(1);
});
