const { checkMatch } = require('../../src/filters/excludepatterns');

test('Equals signs', () => {
  expect(checkMatch("test")).toStrictEqual(1);
  expect(checkMatch("test=")).toStrictEqual(1);
  expect(checkMatch("test==")).toStrictEqual(1);
  expect(checkMatch("test===")).toStrictEqual(0);
});

test('Double colon separator', () => {
  expect(checkMatch("MyClass:MyFunction")).toStrictEqual(1);
  expect(checkMatch(":MyClass:MyFunction:")).toStrictEqual(1);
  expect(checkMatch("MyClass:::MyFunction")).toStrictEqual(1);
  expect(checkMatch("::MyFunction")).toStrictEqual(1);

  expect(checkMatch("MyClass::MyFunction")).toStrictEqual(0);
});
