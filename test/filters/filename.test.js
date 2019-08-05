const Filter = require('../../src/filters/filename');

test('is file name', () => {
  expect(Filter.isMatch(`test-file.js`)).toBe(true);
  expect(Filter.isMatch(`../apis/cloudfront-2018-06-18.min.json`)).toBe(true);
  expect(Filter.isMatch(`arn:aws:s3:::codebuild-123456789012-input-bucket/MessageUtil.zip`)).toBe(true);
  expect(Filter.isMatch(`//cdn.jsdelivr.net/algoliasearch/2/algoliasearch.min.js`)).toBe(true);
  expect(Filter.isMatch(`/mpegps_mp3_unrecognized_format.mpg`)).toBe(true);
  expect(Filter.isMatch(`subfile,,start,32815239,end,0,,:video.ts`)).toBe(true);
  expect(Filter.isMatch(`$(TARGET_PATH)/tests/data/asynth-44100-2.wav`)).toBe(true);
  expect(Filter.isMatch(`tests/data/fate/vsynth1-ffv1-v3-bgr0.avi`)).toBe(true);
  expect(Filter.isMatch(`$(success,$(srctree)/scripts/gcc-x86_32-has-stack-protector.sh`)).toBe(true);
  expect(Filter.isMatch(`<boost/atomic/detail/cas64strong.hpp>`)).toBe(true);
  expect(Filter.isMatch(`libarrow-cuda-glib-dev_{no_rc_version}-1_amd64.deb`)).toBe(true);
  expect(Filter.isMatch(`parenthesized_call_on_property_1.php`)).toBe(true);
  expect(Filter.isMatch(`/certs/pem-utils/key_pkcs8_encrypted.pem`)).toBe(true);
});

test('file name ends with special character', () => {
  expect(Filter.isMatch(`../apis/cloudfront-2018-06-18.min.json:`)).toBe(true);
  expect(Filter.isMatch(`../apis/cloudfront-2018-06-18.min.json?`)).toBe(true);
  expect(Filter.isMatch(`@file{segment_20170102194334_0004_00120072_0000003000000.ts}`)).toBe(true);
  expect(Filter.isMatch(`ftp://ftp.hpl.hp.com/pub/linux-ia64/gas-030124.tar.gz)`)).toBe(true);

  expect(Filter.isMatch(`../apis/cloudfront-2018-06-18.min.json1`)).toBe(false);
});

test('file name with line number', () => {
  expect(Filter.isMatch("wineh-statenumbering-cleanups.ll:13:1:")).toBe(true);
})
