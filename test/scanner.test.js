const Scanner = require('../src/Scanner');

test("dedupe secrets", () => {
  // two distinct secrets
  expect(Scanner.dedupeSecrets([{ secret: 'test1' }, { secret: 'test2' }])).toStrictEqual([{ secret: 'test1' }, { secret: 'test2' }]);

  // three secrets: unique, unique, match
  expect(Scanner.dedupeSecrets([{ secret: 'test1' }, { secret: 'test2' }, { secret: 'test1' }])).toStrictEqual([{ secret: 'test1' }, { secret: 'test2' }]);

  // three secrets: unique, match, unique
  expect(Scanner.dedupeSecrets([{ secret: 'test1' }, { secret: 'test1' }, { secret: 'test2' }])).toStrictEqual([{ secret: 'test1' }, { secret: 'test2' }]);
});
