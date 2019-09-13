const Secret = require('../src/Secret');

test("contructor", () => {
  expect(() => new Secret()).toThrow();
});

test("get terms", () => {
  const secret = new Secret("test");
  expect(secret.getTerms(`one`)).toStrictEqual(["one"]);
  expect(secret.getTerms(`one   two`)).toStrictEqual(["one", "two"]);

  expect(secret.getTerms(`one      `)).toStrictEqual(["one", ""]);
});

test("should scan", () => {
  const tag = "TEST_TAG";

  // no tags explicitly specified
  let secret = new Secret("test");
  expect(secret.shouldScan(new Set([tag]))).toBe(true);

  // tag is whitelisted
  secret = new Secret("test", { fileTags: [tag]});
  expect(secret.shouldScan(new Set([tag]))).toBe(true);

  // tag is blacklisted
  secret = new Secret("test", { excludedFileTags: [tag]});
  expect(secret.shouldScan(new Set([tag]))).toBe(false);

  // tag is whitelisted and blacklisted
  secret = new Secret("test", { fileTags: [tag], excludedFileTags: [tag]});
  expect(secret.shouldScan(new Set([tag]))).toBe(true);
});
