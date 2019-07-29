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
  expect(file2.fullPath()).toStrictEqual("/root//test.txt");

  const file3 = new File("test.txt", "/a/lot/of/sub/dirs");
  expect(file3.fullPath()).toStrictEqual("/a/lot/of/sub/dirs/test.txt");
});
