const { checkMatch } = require('../../src/filters/excludepaths');

test('paths', () => {
  expect(checkMatch("/root/test/path")).toBe(0);
  expect(checkMatch("/root/test/path/")).toBe(0);
  expect(checkMatch("/root/test.txt")).toBe(0);
  expect(checkMatch("./test")).toBe(0);
  expect(checkMatch("../test")).toBe(0);
  expect(checkMatch("////root")).toBe(0);
});

test('not paths', () => {
  expect(checkMatch("test")).toBe(1);
  expect(checkMatch("test.txt")).toBe(1);
  expect(checkMatch(".test.txt")).toBe(1);
  expect(checkMatch("test/test")).toBe(1);
});
