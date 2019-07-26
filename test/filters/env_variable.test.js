const Filter = require('../../src/filters/env_variable');

test('is env variable', () => {
  expect(Filter.isMatch("DOPPLER_API_KEY=9rw8yesiuoijpfthgwisjifohudklfji")).toBe(true);
  expect(Filter.isMatch("DOPPLER_API_KEY=\"9rw8yesiuoijpfthgwisjifohudklfji\"")).toBe(true);
  expect(Filter.isMatch("DOPPLER_API_KEY='9rw8yesiuoijpfthgwisjifohudklfji'")).toBe(true);
});

test('is not env variable', () => {
  expect(Filter.isMatch("DOPPLER_API_KEY")).toBe(false);
});
