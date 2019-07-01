const File = require('../../src/objects/file');
const Key = require('../../src/objects/key');
const ScannedFile = require('../../src/objects/scannedfile');

test('toObject- no keys', () => {
  const file = new File("test.txt", "/root", 123);
  const scannedFile = new ScannedFile(file);

  expect(scannedFile.toObject()).toStrictEqual({
    metadata: {
      fileSize: 123,
      fileExtension: "txt",
    },
    keys: [],
  });
});

test('toObject- with keys', () => {
  const file = new File("test.txt", "/root", 123);
  const scannedFile = new ScannedFile(file);
  scannedFile.addKey(new Key("thisisasecret", "text thisisasecret more text", 13, .8));
  scannedFile.addKey(new Key("anothersecret", "hi anothersecret", 21, .95));

  expect(scannedFile.toObject()).toStrictEqual({
    metadata: {
      fileSize: 123,
      fileExtension: "txt",
    },
    keys: [
      {
        key: "thisisasecret",
        line: "text thisisasecret more text",
        lineNumber: 13,
        score: .8,
      },
      {
        key: "anothersecret",
        line: "hi anothersecret",
        lineNumber: 21,
        score: .95,
      },
    ],
  });
});

test('toObject- max length', () => {
  const file = new File("test.txt", "/root", 123);
  const scannedFile = new ScannedFile(file);
  const stringLongerThan100Chars = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
  scannedFile.addKey(new Key("thisisasecret", stringLongerThan100Chars, 13, .8));

  expect(scannedFile.toObject()).toStrictEqual({
    metadata: {
      fileSize: 123,
      fileExtension: "txt",
    },
    keys: [
      {
        key: "thisisasecret",
        line: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuv",
        lineNumber: 13,
        score: .8,
      },
    ],
  });
});

test('hasKeys', () => {
  const file = new File("test.txt", "/root", 123);

  const scannedFile = new ScannedFile(file);
  expect(scannedFile.hasKeys()).toStrictEqual(false);

  scannedFile.addKey(new Key("thisisasecret", 13, .8));
  expect(scannedFile.hasKeys()).toStrictEqual(true);
});
