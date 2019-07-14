const { checkMatch, calculateEntropy } = require('../../src/filters/entropy');

test('entropy calculation', () => {
  expect(calculateEntropy("1223334444")).toStrictEqual(1.8464393446710154);
  expect(calculateEntropy("0123")).toStrictEqual(2);
  expect(calculateEntropy("0123456789abc")).toStrictEqual(3.7004397181410926);
  expect(calculateEntropy("0123456789abcdef")).toStrictEqual(4);
  expect(calculateEntropy("0123456789abcdefghijklmnopqrst")).toStrictEqual(4.906890595608519);
  expect(calculateEntropy("0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=")).toStrictEqual(5.643856189774728);
});

test('entropy score', () => {
  expect(checkMatch("1223334444")).toHaveProperty("score", 0);
  expect(checkMatch("0123")).toHaveProperty("score", 0);
  expect(checkMatch("0123456789abc")).toHaveProperty("score", 0);
  expect(checkMatch("0123456789abcdef")).toHaveProperty("score", .8);
  expect(checkMatch("0123456789abcdefghijklmnopqrst")).toHaveProperty("score", .9);
  expect(checkMatch("0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=")).toHaveProperty("score", 1);
});
