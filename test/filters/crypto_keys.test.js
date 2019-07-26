const Filter = require('../../src/filters/crypto_keys');

test('private key', () => {
  expect(Filter.isMatch("-----BEGIN RSA PRIVATE KEY-----")).toBe(true);
  expect(Filter.isMatch("-----begin rsa private key-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN PRIVATE KEY-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN DSA PRIVATE KEY-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN EC PRIVATE KEY-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN PGP PRIVATE KEY BLOCK-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN OPENSSH PRIVATE KEY-----")).toBe(true);
});
