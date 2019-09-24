const globs = require('../src/globs');

test("globs", async () => {
  expect(globs.isMatch("/test", "**/test")).toBe(true);
  expect(globs.isMatch("/root/test", "**/test")).toBe(true);

  expect(globs.isMatch("/root/test.txt", "**/test")).toBe(false);
});
