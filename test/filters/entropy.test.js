const { checkMatch, calculateEntropy } = require('../../src/filters/entropy');

test('entropy calculation', () => {
  expect(calculateEntropy("1223334444")).toBe(1.8464393446710154);
  expect(calculateEntropy("0123")).toBe(2);
  expect(calculateEntropy("0123456789abc")).toBe(3.7004397181410926);
  expect(calculateEntropy("0123456789abcdef")).toBe(4);
  expect(calculateEntropy("0123456789abcdefghijklmnopqrst")).toBe(4.906890595608519);
  expect(calculateEntropy("0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=")).toBe(5.643856189774728);

  expect(checkMatch("1223334444")).toBe(0);
  expect(checkMatch("0123")).toBe(0);
  expect(checkMatch("0123456789abc")).toBe(0);
  expect(checkMatch("0123456789abcdef")).toBe(.8);
  expect(checkMatch("0123456789abcdefghijklmnopqrst")).toBe(.9);
  expect(checkMatch("0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=")).toBe(1);
});
