const Filter = require('../../src/filters/ipaddress');

test('is ipv6 address', () => {
  expect(Filter.isMatch(`ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`)).toBe(true);
  expect(Filter.isMatch(`2001:0db8:85a3:0042:1000:8a2e:0370:7334`)).toBe(true);
  expect(Filter.isMatch(`2001:0Db8:85a3:0042:1000:8a2E:0370:7334`)).toBe(true);
  expect(Filter.isMatch(`2001:0db8:85a3:0042:1000:8a2e:0370:7334/128`)).toBe(true);
  expect(Filter.isMatch(`[2001:0db8:85a3:0042:1000:8A2E:0370:7334]`)).toBe(true);
});

test('is not ipv6 ip', () => {
  expect(Filter.isMatch("DOPPLER_API_KEY")).toBe(false);
  expect(Filter.isMatch("")).toBe(false);
});
