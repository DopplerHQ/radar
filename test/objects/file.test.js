const File = require('../../src/objects/file');

test('extension', () => {
  const file1 = new File("test.txt");
  expect(file1.extension()).toStrictEqual("txt");

  const file2 = new File("index.min.js");
  expect(file2.extension()).toStrictEqual("min.js");

  const file3 = new File("indexmin.js");
  expect(file3.extension()).toStrictEqual("js");

  const file4 = new File("master.tar.gz");
  expect(file4.extension()).toStrictEqual("tar.gz");

  const file5 = new File("test.crt.json");
  expect(file5.extension()).toStrictEqual("crt.json");

  const file6 = new File("test.test1.test2.test3");
  expect(file6.extension()).toStrictEqual("test1.test2.test3");
});

test('no extension', () => {
  const file = new File("noextension");
  expect(file.extension()).toStrictEqual("");
});

test('full path', () => {
  const file1 = new File("test.txt", "/root");
  expect(file1.fullPath()).toStrictEqual("/root/test.txt");

  const file2 = new File("test.txt", "/root/");
  expect(file2.fullPath()).toStrictEqual("/root/test.txt");

  const file3 = new File("test.txt", "/a/lot/of/sub/dirs");
  expect(file3.fullPath()).toStrictEqual("/a/lot/of/sub/dirs/test.txt");
});

test('relative path', () => {
  let file = new File("test.txt", "/root/dir/src", "/root/dir");
  expect(file.relativePath()).toStrictEqual("src/test.txt");

  file = new File("test.txt", "/root/dir/src/", "/root/dir");
  expect(file.relativePath()).toStrictEqual("src/test.txt");
});

test("relative path - no trailing slash", () => {
  const path = "/root/dir";

  let file = new File("test.txt", path, path);
  expect(file.relativePath()).toStrictEqual("test.txt");

  file = new File("test.txt", `${path}/dir2`, path);
  expect(file.relativePath()).toStrictEqual("dir2/test.txt");

  file = new File("test.txt", `${path}/dir3/dir4`, path);
  expect(file.relativePath()).toStrictEqual("dir3/dir4/test.txt");

  file = new File("test.txt", `${path}/dir3/dir4`, `${path}/dir3`);
  expect(file.relativePath()).toStrictEqual("dir4/test.txt");
});

test("relative path - trailing slash(es)", () => {
  const path = "/root/dir////";

  let file = new File("test.txt", path, path);
  expect(file.relativePath()).toStrictEqual("test.txt");

  file = new File("test.txt", `${path}/dir2`, path);
  expect(file.relativePath()).toStrictEqual("dir2/test.txt");

  file = new File("test.txt", `${path}/dir3/dir4`, path);
  expect(file.relativePath()).toStrictEqual("dir3/dir4/test.txt");

  file = new File("test.txt", `${path}/dir3/dir4`, `${path}/dir3`);
  expect(file.relativePath()).toStrictEqual("dir4/test.txt");
});

test("relative path - edge cases", () => {
  let file = new File("README.md", "", "");
  expect(file.relativePath()).toStrictEqual("README.md");

  file = new File("README.md", ".", ".");
  expect(file.relativePath()).toStrictEqual("README.md");

  file = new File("README.md", "./", "./");
  expect(file.relativePath()).toStrictEqual("README.md");

  file = new File("./README.md", "./", "./");
  expect(file.relativePath()).toStrictEqual("README.md");

  file = new File("./README.md", ".", ".");
  expect(file.relativePath()).toStrictEqual("README.md");

  file = new File("test/README.md", ".", ".");
  expect(file.relativePath()).toStrictEqual("test/README.md");

  file = new File("test/README.md", "./", "./");
  expect(file.relativePath()).toStrictEqual("test/README.md");
});
