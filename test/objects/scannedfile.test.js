const File = require('../../src/objects/file');
const Secret = require('../../src/objects/secret');
const ScannedFile = require('../../src/objects/scannedfile');

test('toObject- no secrets', () => {
  const file = new File("test.txt", "/root", 123);
  const scannedFile = new ScannedFile(file);

  expect(scannedFile.toObject()).toStrictEqual({
    metadata: {
      fileSize: 123,
      fileExtension: "txt",
    },
    secrets: [],
  });
});

test('toObject- with secrets', () => {
  const file = new File("test.txt", "/root", 123);
  const scannedFile = new ScannedFile(file);
  scannedFile.addSecret("thisisasecret", "API Key", "text thisisasecret more text", 13);
  scannedFile.addSecret("anothersecret", "Auth URL", "hi anothersecret", 21);

  expect(scannedFile.toObject()).toStrictEqual({
    metadata: {
      fileSize: 123,
      fileExtension: "txt",
    },
    secrets: [
      {
        secret: "thisisasecret",
        type: "API Key",
        line: "text thisisasecret more text",
        lineNumber: 13
      },
      {
        secret: "anothersecret",
        type: "Auth URL",
        line: "hi anothersecret",
        lineNumber: 21
      },
    ],
  });
});

test('hasSecrets', () => {
  const file = new File("test.txt", "/root", 123);

  const scannedFile = new ScannedFile(file);
  expect(scannedFile.hasSecrets()).toStrictEqual(false);

  scannedFile.addSecret("", "", "", 0);
  expect(scannedFile.hasSecrets()).toStrictEqual(true);
});
