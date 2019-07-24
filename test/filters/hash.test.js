const Filter = require('../../src/filters/hash');

test('hash', () => {
  expect(Filter.isMatch('md5-YICcOcv/VTNyJv1eC1IPNB8ftcY=')).toBe(true);
  expect(Filter.isMatch('sha1-YICcOcv/VTNyJv1eC1IPNB8ftcY=')).toBe(true);
  expect(Filter.isMatch('sha2-YICcOcv/VTNyJv1eC1IPNB8ftcY=')).toBe(true);
  expect(Filter.isMatch('SHA256:vCNX7eUkdvqqW0m4PoxQAZRv+CM4P4fS8+CbliAvS4k')).toBe(true);
  expect(Filter.isMatch('sha3-YICcOcv/VTNyJv1eC1IPNB8ftcY=')).toBe(true);
  expect(Filter.isMatch('sha512-OfC2uemaknXr87bdLUkWog7nYuliM9Ij5HUcajsVcMCpQrcLmtxRbVFTIqmcSkSeYRBFBRxs2FiUqFJDLdiebA==')).toBe(true);
  expect(Filter.isMatch('sha256-OfC2uemaknXr87bdLUkWog7nYuliM9Ij5HUcajsVcMCpQrcLmtxRbVFTIqmcSkSeYRBFBRxs2FiUqFJDLdiebA==')).toBe(true);
  expect(Filter.isMatch('sha1-+PwEyjoTeErenhZBr5hXjPvWR6k=')).toBe(true);
  expect(Filter.isMatch('sha1-/P+wEyjoTeErenhZBr5hXjPvWR6k=')).toBe(true);
});

test('not hash', () => {
  expect(Filter.isMatch('md5')).toBe(false);
  expect(Filter.isMatch('test-md5')).toBe(false);
  expect(Filter.isMatch('sha512')).toBe(false);
  expect(Filter.isMatch('test-sha512')).toBe(false);
});
