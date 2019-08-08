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
