const Filter = require('../../src/filters/public_keys');

test('public key', () => {
  expect(Filter.isMatch("-----BEGIN RSA PUBLIC KEY-----")).toBe(true);
  expect(Filter.isMatch("-----begin rsa public key-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN PUBLIC KEY-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN DSA PUBLIC KEY-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN DH PUBLIC KEY-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN EC PUBLIC KEY-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN PGP PUBLIC KEY BLOCK-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN OPENSSH PUBLIC KEY-----")).toBe(true);
});

test('certificate', () => {
  expect(Filter.isMatch("-----BEGIN CERTIFICATE-----")).toBe(true);
  expect(Filter.isMatch("-----BEGIN PUBLIC CERTIFICATE-----")).toBe(true);
});
