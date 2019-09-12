const Scanner = require('../src/Scanner');

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
