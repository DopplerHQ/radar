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

  const file5 = new File("noextension");
  expect(file5.extension()).toStrictEqual("");
});

test('full path', () => {
  const file1 = new File("test.txt", "/root");
  expect(file1.fullPath()).toStrictEqual("/root/test.txt");

  const file2 = new File("test.txt", "/root/");
  expect(file2.fullPath()).toStrictEqual("/root//test.txt");

  const file3 = new File("test.txt", "/a/lot/of/sub/dirs");
  expect(file3.fullPath()).toStrictEqual("/a/lot/of/sub/dirs/test.txt");
});
