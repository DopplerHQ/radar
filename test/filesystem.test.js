const Filesystem = require('../src/filesystem');

test("relative path - no trailing slash", () => {
  const path = "/root/dir";

  expect(Filesystem.getRelativePath(`${path}/test.txt`, path)).toStrictEqual("test.txt");
  expect(Filesystem.getRelativePath(`${path}/dir2/test.txt`, path)).toStrictEqual("dir2/test.txt");
  expect(Filesystem.getRelativePath(`${path}/dir3/dir4/test.txt`, path)).toStrictEqual("dir3/dir4/test.txt");
});

test("relative path - trailing slash(es)", () => {
  const path = "/root/dir////";

  expect(Filesystem.getRelativePath(`${path}/test.txt`, path)).toStrictEqual("test.txt");
  expect(Filesystem.getRelativePath(`${path}/dir2/test.txt`, path)).toStrictEqual("dir2/test.txt");
  expect(Filesystem.getRelativePath(`${path}/dir3/dir4/test.txt`, path)).toStrictEqual("dir3/dir4/test.txt");
});
