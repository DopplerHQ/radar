const { checkMatch } = require('../../src/filters/excludepatterns');

test('Equals signs', () => {
  expect(checkMatch("test=")).toStrictEqual(1);
  expect(checkMatch("test==")).toStrictEqual(1);
  expect(checkMatch("test===")).toStrictEqual(0);
});
