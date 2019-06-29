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
  scannedFile.addKey(new Key("thisisasecret", 13, .8));
  scannedFile.addKey(new Key("anothersecret", 21, .95));

  expect(scannedFile.toObject()).toStrictEqual({
    metadata: {
      fileSize: 123,
      fileExtension: "txt",
    },
    keys: [
      {
        key: "thisisasecret",
        lineNumber: 13,
        score: .8,
      },
      {
        key: "anothersecret",
        lineNumber: 21,
        score: .95,
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
