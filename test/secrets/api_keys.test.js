const APIKeys = require('../../src/secrets/api_keys');
const FileTags = require('../../src/objects/file_tags');

test('should scan', () => {
  expect(APIKeys.shouldScan(new Set([]))).toBe(true);
  expect(APIKeys.shouldScan(new Set([FileTags.README]))).toBe(true);
  expect(APIKeys.shouldScan(new Set([FileTags.README, FileTags.NO_EXTENSION]))).toBe(true);

  expect(APIKeys.shouldScan(new Set([FileTags.CRYPTO_PRIVATE_KEY]))).toBe(false);
  expect(APIKeys.shouldScan(new Set([FileTags.CRYPTO_PUBLIC_KEY]))).toBe(false);
  expect(APIKeys.shouldScan(new Set([FileTags.NO_EXTENSION]))).toBe(false);
  expect(APIKeys.shouldScan(new Set([FileTags.ENV_FILE]))).toBe(false);
});

test('get terms', () => {
  expect(APIKeys.getTerms("abc123def456ghi789jklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz")).toStrictEqual(["abc123def456ghi789jklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"]);

  expect(APIKeys.getTerms("function assert return")).toStrictEqual([]);

  const prevMaxLineLength = APIKeys.maxLineLength;
  APIKeys.maxLineLength = 8;
  expect(APIKeys.getTerms("123456789")).toStrictEqual([]);
  APIKeys.maxLineLength = prevMaxLineLength;
});

test('is alpha numeric', () => {
  expect(APIKeys.isAlphaNumeric("abc 1 2 3")).toStrictEqual(true);

  expect(APIKeys.isAlphaNumeric("abc")).toStrictEqual(false);
  expect(APIKeys.isAlphaNumeric("abc123")).toStrictEqual(false);
  expect(APIKeys.isAlphaNumeric("123")).toStrictEqual(false);
  expect(APIKeys.isAlphaNumeric("1 2 3")).toStrictEqual(false);
  // must have 3 distinct groups of numbers
  expect(APIKeys.isAlphaNumeric("abc 1 2 2")).toStrictEqual(false);
});

test('terms excluded by regex', () => {
  expect(APIKeys.getTerms("pk_test_uhHMJ7wv13LbAl5rmfZvI08d")).toStrictEqual([]);
  expect(APIKeys.getTerms("pk_live_uhHMJ7wv13LbAl5rmfZvI08d")).toStrictEqual([]);
  expect(APIKeys.getTerms("iauth_1CmMk2IyNTgGDVfzFKlCm0gU")).toStrictEqual([]);
});
