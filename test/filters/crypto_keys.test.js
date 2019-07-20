const Filter = require('../../src/filters/crypto_keys');

test('private key', () => {
  expect(Filter.checkMatch("-----BEGIN RSA PRIVATE KEY-----")).toBe(true);
  expect(Filter.checkMatch("-----begin rsa private key-----")).toBe(true);
  expect(Filter.checkMatch("-----BEGIN PRIVATE KEY-----")).toBe(true);
  expect(Filter.checkMatch("-----BEGIN DSA PRIVATE KEY-----")).toBe(true);
  expect(Filter.checkMatch("-----BEGIN EC PRIVATE KEY-----")).toBe(true);
  expect(Filter.checkMatch("-----BEGIN PGP PRIVATE KEY BLOCK-----")).toBe(true);
  expect(Filter.checkMatch("-----BEGIN OPENSSH PRIVATE KEY-----")).toBe(true);
});
