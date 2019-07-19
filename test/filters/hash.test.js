const Filter = require('../../src/filters/hash');

test('hash', () => {
  expect(Filter.checkMatch('md5-YICcOcv/VTNyJv1eC1IPNB8ftcY=')).toBe(true);
  expect(Filter.checkMatch('sha1-YICcOcv/VTNyJv1eC1IPNB8ftcY=')).toBe(true);
  expect(Filter.checkMatch('sha512-OfC2uemaknXr87bdLUkWog7nYuliM9Ij5HUcajsVcMCpQrcLmtxRbVFTIqmcSkSeYRBFBRxs2FiUqFJDLdiebA==')).toBe(true);
  expect(Filter.checkMatch('sha256-OfC2uemaknXr87bdLUkWog7nYuliM9Ij5HUcajsVcMCpQrcLmtxRbVFTIqmcSkSeYRBFBRxs2FiUqFJDLdiebA==')).toBe(true);
});
