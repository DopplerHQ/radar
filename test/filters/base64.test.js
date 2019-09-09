const Filter = require('../../src/filters/base64');

test('is base64 encoded', () => {
  expect(Filter.isMatch("dGhpc2lzYXRlc3Q=")).toBe(true);
  expect(Filter.isMatch("dGhpc2lzYXRlc3Q==")).toBe(true);
});

test('is not base64 encoded', () => {
  expect(Filter.isMatch("VGhpcyBpcyBzaW1wbGUgQVNDSUkgQmFzZTY0IGZvciBTdGFja092ZXJmbG93IGV4YW1wbGUu")).toBe(false);
  expect(Filter.isMatch("")).toBe(false);
});
