const Radar = require('../src/radar');

test("absolute path replacement - no trailing slash", () => {
  const path = "/root/dir";
  const scanResults = {
    [path + "/test.txt"]: {},
    [path + "/dir2/test.txt"]: {},
    [path + "/dir3/dir4/test.txt"]: {},
  };
  const results = Radar._replaceAbsolutePaths(path, scanResults);
  expect(Object.keys(results)).toStrictEqual([
    "test.txt",
    "dir2/test.txt",
    "dir3/dir4/test.txt",
  ])
});

test("absolute path replacement - trailing slash(es)", () => {
  const path = '/root/dir////';
  const scanResults = {
    [path + "/test.txt"]: {},
    [path + "/dir2/test.txt"]: {},
    [path + "/dir3/dir4/test.txt"]: {},
  };
  const results = Radar._replaceAbsolutePaths(path, scanResults);
  expect(Object.keys(results)).toStrictEqual([
    "test.txt",
    "dir2/test.txt",
    "dir3/dir4/test.txt",
  ])
});
