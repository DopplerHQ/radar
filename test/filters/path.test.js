const Filter = require('../../src/filters/path');

test('path', () => {
  expect(Filter.checkMatch("/root/test/path")).toBe(true);
  expect(Filter.checkMatch("/root/test/path/")).toBe(true);
  expect(Filter.checkMatch("/root/test.txt")).toBe(true);
  expect(Filter.checkMatch("./test")).toBe(true);
  expect(Filter.checkMatch("../test")).toBe(true);
  expect(Filter.checkMatch("////root")).toBe(true);
  expect(Filter.checkMatch("C:\\\\Windows\\System32\\virus.exe")).toBe(true);
});

test('not paths', () => {
  expect(Filter.checkMatch("test")).toBe(false);
  expect(Filter.checkMatch("test.txt")).toBe(false);
  expect(Filter.checkMatch(".test.txt")).toBe(false);
  expect(Filter.checkMatch("test/test")).toBe(false);
  expect(Filter.checkMatch("https://doppler.com")).toBe(false);
});
