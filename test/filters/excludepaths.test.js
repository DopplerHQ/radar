const Filter = require('../../src/filters/excludepaths');

test('paths', () => {
  expect(Filter.checkMatch("/root/test/path")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("/root/test/path/")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("/root/test.txt")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("./test")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("../test")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("////root")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("C:\\\\Windows\\System32\\virus.exe")).toHaveProperty("score", 0);
});

test('not paths', () => {
  expect(Filter.checkMatch("test")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test.txt")).toHaveProperty("score", 1);
  expect(Filter.checkMatch(".test.txt")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test/test")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("https://doppler.com")).toHaveProperty("score", 1);
});
