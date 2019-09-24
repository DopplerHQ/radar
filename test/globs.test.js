const globs = require('../src/globs');

test("directories", async () => {
  expect(globs.isMatch("/test", "**/test")).toBe(true);
  expect(globs.isMatch("/root/test", "**/test")).toBe(true);

  expect(globs.isMatch("/root/test.txt", "**/test")).toBe(false);
});

test("equivalence", async () => {
  expect(globs.isMatch("/test", "**/test")).toBe(true);
  expect(globs.isMatch("/test", "**/test/")).toBe(false);

  expect(globs.isMatch("/test", "test")).toBe(false);
  expect(globs.isMatch("/test", "test/")).toBe(false);
});
