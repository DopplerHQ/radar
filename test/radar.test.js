const Radar = require('../src/radar');

test("absolute path replacement - no trailing slash", () => {
  const path = "/root/dir";

  expect(Radar._getRelativePath(path, `${path}/test.txt`)).toStrictEqual("test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir2/test.txt`)).toStrictEqual("dir2/test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir3/dir4/test.txt`)).toStrictEqual("dir3/dir4/test.txt");
});

test("absolute path replacement - trailing slash(es)", () => {
  const path = "/root/dir////";

  expect(Radar._getRelativePath(path, `${path}/test.txt`)).toStrictEqual("test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir2/test.txt`)).toStrictEqual("dir2/test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir3/dir4/test.txt`)).toStrictEqual("dir3/dir4/test.txt");
});
