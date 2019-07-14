const { checkMatch } = require('../../src/filters/excludepaths');

test('paths', () => {
  expect(checkMatch("/root/test/path")).toHaveProperty("score", 0);
  expect(checkMatch("/root/test/path/")).toHaveProperty("score", 0);
  expect(checkMatch("/root/test.txt")).toHaveProperty("score", 0);
  expect(checkMatch("./test")).toHaveProperty("score", 0);
  expect(checkMatch("../test")).toHaveProperty("score", 0);
  expect(checkMatch("////root")).toHaveProperty("score", 0);
  expect(checkMatch("C:\\\\Windows\\System32\\virus.exe")).toHaveProperty("score", 0);
});

test('not paths', () => {
  expect(checkMatch("test")).toHaveProperty("score", 1);
  expect(checkMatch("test.txt")).toHaveProperty("score", 1);
  expect(checkMatch(".test.txt")).toHaveProperty("score", 1);
  expect(checkMatch("test/test")).toHaveProperty("score", 1);
  expect(checkMatch("https://doppler.com")).toHaveProperty("score", 1);
});
