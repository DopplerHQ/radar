const Filter = require('../../src/filters/xml');

test('is xml tag', () => {
  expect(Filter.isMatch('<td></td>')).toBe(true);
  expect(Filter.isMatch('<td>testtest</td>')).toBe(true);
  expect(Filter.isMatch('<td1>testtest</td>')).toBe(true);
  expect(Filter.isMatch('<td>testtest</td1>')).toBe(true);
  expect(Filter.isMatch('<td1>testtest</td1>')).toBe(true);
  expect(Filter.isMatch('<td-td>testtest</td-td>')).toBe(true);
  expect(Filter.isMatch('><title>dssmrecommendernetwork0_dense0_fwd</title>')).toBe(true);
});

test('not xml tag', () => {
  expect(Filter.isMatch('')).toBe(false);
  expect(Filter.isMatch(' ')).toBe(false);
  expect(Filter.isMatch('<td>')).toBe(false);
  expect(Filter.isMatch('test-sha512')).toBe(false);
});
