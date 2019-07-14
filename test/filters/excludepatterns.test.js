const { checkMatch } = require('../../src/filters/excludepatterns');

test('Equals signs', () => {
  expect(checkMatch("test")).toHaveProperty("score", 1);
  expect(checkMatch("test=")).toHaveProperty("score", 1);
  expect(checkMatch("test==")).toHaveProperty("score", 1);
  expect(checkMatch("test===")).toHaveProperty("score", 0);
});

test('Double colon separator', () => {
  expect(checkMatch("MyClass:MyFunction")).toHaveProperty("score", 1);
  expect(checkMatch(":MyClass:MyFunction:")).toHaveProperty("score", 1);
  expect(checkMatch("MyClass:::MyFunction")).toHaveProperty("score", 1);
  expect(checkMatch("::MyFunction")).toHaveProperty("score", 1);

  expect(checkMatch("MyClass::MyFunction")).toHaveProperty("score", 0);
});
