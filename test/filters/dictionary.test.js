const Filter = require('../../src/filters/dictionary');

// TODO configure minimumMatchPercentage to 1 so that these tests are more deterministic
test('mixed case', () => {
  expect(Filter.checkMatch("test Hello")).toBe(true);
  expect(Filter.checkMatch("hey There Hello")).toBe(true);
  expect(Filter.checkMatch("test test test")).toBe(true);
  expect(Filter.checkMatch("test lsdjfoasdfosdhf")).toBe(true);
  expect(Filter.checkMatch("STRIPE_API_KEY=123456d781fdf0dfdf323434cvfdfgyddf")).toBe(true);
  expect(Filter.checkMatch("test randomgarbage rndmgrbg")).toBe(true);

  expect(Filter.checkMatch("randomgarbage")).toBe(false);
  expect(Filter.checkMatch("fooz barz")).toBe(false);
  expect(Filter.checkMatch("te1st randomgarbage rndmgrbg")).toBe(false);
});

test('camel case', () => {
  expect(Filter.checkMatch("randomGarbage")).toBe(true);
  expect(Filter.checkMatch("wordNotword")).toBe(true);
  expect(Filter.checkMatch("thisIsForTestingPurposes")).toBe(true);
  expect(Filter.checkMatch("notwordAlsonotword")).toBe(false);
});

test('symbols', () => {
  expect(Filter.checkMatch("case-sensitive")).toBe(true);
  expect(Filter.checkMatch("to-retrieve-a-list-of-the-handshakes-sent-to-an-account-1472510214747")).toBe(true);
  expect(Filter.checkMatch("January February March April May June July August September October November December")).toBe(true);
  expect(Filter.checkMatch("January_February_March_April_May_June_July_August_September_October_November_December")).toBe(true);
  expect(Filter.checkMatch("another_'\"@()[]<>{};:,.?!/\\\^\`-test")).toBe(true);
  expect(Filter.checkMatch("!__webpack_require__(225).ABV,")).toBe(true);
  expect(Filter.checkMatch("(!base64Chars[buf[i]])")).toBe(true);
  expect(Filter.checkMatch("!inline.isBase64Path(")).toBe(true);
});

test('custom dictionary', () => {
  expect(Filter.checkMatch("polyfill")).toBe(true);
  expect(Filter.checkMatch("Polyfill")).toBe(true);
  expect(Filter.checkMatch("AWS")).toBe(true);
  expect(Filter.checkMatch("PolyfillAWS")).toBe(true);
});

test('numbers', () => {
  expect(Filter.checkMatch("404")).toBe(true);
  expect(Filter.checkMatch("mp4")).toBe(true);
});

test('split terms', () => {
  expect(Filter._splitIntoTerms("testWords")).toStrictEqual(["test", "words"]);
  expect(Filter._splitIntoTerms("testWORDS")).toStrictEqual(["test", "words"]);
  expect(Filter._splitIntoTerms("TEST_WORDS")).toStrictEqual(["test", "words"]);
  expect(Filter._splitIntoTerms("TESTwords")).toStrictEqual(["tes", "twords"]);
  expect(Filter._splitIntoTerms("test123Words")).toStrictEqual(["test123", "words"]);
  expect(Filter._splitIntoTerms("STRIPE_API_KEY=123456d781fdf0dfdf323434cvfdfgyddf")).toStrictEqual(["stripe", "api", "key", "123456d781fdf0dfdf323434cvfdfgyddf"]);
  expect(Filter._splitIntoTerms("to-retrieve-a-list-of-the-handshakes-sent-to-an-account-1472510214747")).toStrictEqual(["retrieve", "list", "the", "handshakes", "sent", "account", "1472510214747"]);
  expect(Filter._splitIntoTerms("January_February_March_April_May_June_July_August_September_October_November_December")).toStrictEqual(["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]);
  expect(Filter._splitIntoTerms("another_'\"@()[]<>{};:,.?!/\\\^\`-test")).toStrictEqual(["another", "test"]);
  expect(Filter._splitIntoTerms("(!base64Chars[buf[i]])")).toStrictEqual(["base64", "chars", "buf"]);
  expect(Filter._splitIntoTerms("!inline.isBase64Path(")).toStrictEqual(["inline", "base64", "path"]);
});
