const File = require('../../src/objects/file');
const ScannedFile = require('../../src/objects/scannedfile');

test('toObject- no secrets', () => {
  const file = new File("test.txt", "/root", "", 123);
  const scannedFile = new ScannedFile(file);

  expect(scannedFile.toObject()).toStrictEqual({
    metadata: {
      size: 123,
      extension: ".txt",
      numLines: 0,
    },
    lines: [],
  });
});

test('toObject- with secrets', () => {
  const file = new File("test.txt", "/root", "", 123);
  const scannedFile = new ScannedFile(file);
  for (let i = 0; i < 25; ++i) {
    scannedFile.file().incrNumLines();
  }
  scannedFile.addSecret("thisisasecret", "API Key", "text thisisasecret more text", 13);
  scannedFile.addSecret("anothersecret", "Auth URL", "hi anothersecret", 21);

  expect(scannedFile.toObject()).toStrictEqual({
    metadata: {
      size: 123,
      extension: ".txt",
      numLines: 25,
    },
    lines: [
      {
        line: "text thisisasecret more text",
        lineNumber: 13,
        findings: [
          {
            text: "thisisasecret",
            type: "API Key",
            metadata: {},
          },
        ]
      },
      {
        line: "hi anothersecret",
        lineNumber: 21,
        findings: [
          {
            text: "anothersecret",
            type: "Auth URL",
            metadata: {},
          },
        ]
      },
    ],
  });
});

test('has secrets', () => {
  const file = new File("test.txt", "/root", "", 123);

  const scannedFile = new ScannedFile(file);
  expect(scannedFile.hasSecrets()).toStrictEqual(false);

  scannedFile.addSecret("", "", "", 0);
  expect(scannedFile.hasSecrets()).toStrictEqual(true);
});

test('number of secrets', () => {
  const file = new File("test.txt", "/root", "", 123);

  const scannedFile = new ScannedFile(file);
  expect(scannedFile.numSecrets()).toStrictEqual(0);
  scannedFile.addSecret("", "", "", 0);
  expect(scannedFile.numSecrets()).toStrictEqual(1);
  scannedFile.addSecret("", "", "", 0);
  expect(scannedFile.numSecrets()).toStrictEqual(2);
});

test('remove secrets', () => {
  const file = new File("test.txt", "/root", "", 123);

  const scannedFile = new ScannedFile(file);
  scannedFile.addSecret("", "type1", "", 0);
  scannedFile.addSecret("", "type1", "", 0);
  scannedFile.addSecret("", "type2", "", 0);
  expect(scannedFile.numSecrets()).toStrictEqual(3);

  scannedFile.removeSecrets("type1");
  expect(scannedFile.numSecrets()).toStrictEqual(1);
});
