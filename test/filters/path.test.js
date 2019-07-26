const Filter = require('../../src/filters/path');

test('path', () => {
  expect(Filter.isMatch("./test")).toBe(true);
  expect(Filter.isMatch("../test")).toBe(true);
  expect(Filter.isMatch("C:\\\\Windows\\System32\\virus.exe")).toBe(true);
});

test('not paths', () => {
  expect(Filter.isMatch("test")).toBe(false);
  expect(Filter.isMatch("test.txt")).toBe(false);
  expect(Filter.isMatch(".test.txt")).toBe(false);
  expect(Filter.isMatch("test/test")).toBe(false);
  expect(Filter.isMatch("https://doppler.com")).toBe(false);
});
