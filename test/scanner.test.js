const Scanner = require('../src/Scanner');
const ScannedFile = require('../src/objects/scannedfile');
const File = require('../src/objects/file');

test("dedupe secrets", () => {
  // two distinct secrets
  expect(Scanner.dedupeSecrets([{ secret: 'test1' }, { secret: 'test2' }])).toStrictEqual([{ secret: 'test1' }, { secret: 'test2' }]);

  // three secrets: unique, unique, match
  expect(Scanner.dedupeSecrets([{ secret: 'test1' }, { secret: 'test2' }, { secret: 'test1' }])).toStrictEqual([{ secret: 'test1' }, { secret: 'test2' }]);

  // three secrets: unique, match, unique
  expect(Scanner.dedupeSecrets([{ secret: 'test1' }, { secret: 'test1' }, { secret: 'test2' }])).toStrictEqual([{ secret: 'test1' }, { secret: 'test2' }]);
});

test("list secret types w/ filtering", () => {
  expect(Scanner.listSecretTypes(["a"], ["a", "b"])).toStrictEqual(["a"]);
  expect(Scanner.listSecretTypes(["a", "c"], ["a", "b"])).toStrictEqual(["a"]);

  expect(Scanner.listSecretTypes([], ["a", "b"])).toStrictEqual(["a", "b"]);
  expect(Scanner.listSecretTypes(["a"], [])).toStrictEqual([]);
})

test("should scan for secret type", () => {
  const scannedFile = new ScannedFile(new File("a.txt"));
  expect(Scanner.shouldScanForSecretType({ shouldScan: () => true }, scannedFile)).toBe(true);
  expect(Scanner.shouldScanForSecretType({ shouldScan: () => false }, scannedFile)).toBe(false);
});

test("handle tags", () => {
  // TODO assert against scannedFile.tags
  let scannedFile = new ScannedFile(new File("a.txt"));
  Scanner.handleTags([], scannedFile);
  expect(scannedFile.tags()).toStrictEqual(new Set());

  scannedFile = new ScannedFile(new File("a.txt"));
  Scanner.handleTags({ TEST_TAG: true }, scannedFile);
  expect(scannedFile.tags()).toStrictEqual(new Set(["TEST_TAG"]));
});

test("handle tag removeal", () => {
  const scannedFile = new ScannedFile(new File("a.txt"));
  scannedFile.addTag("TEST_TAG");
  expect(scannedFile.tags()).toStrictEqual(new Set(["TEST_TAG"]));

  Scanner.handleTags({ TEST_TAG: false }, scannedFile);
  expect(scannedFile.tags()).toStrictEqual(new Set());
});
