const Radar = require('../src/radar');
const Config = require('../src/config');

test("absolute path replacement - no trailing slash", () => {
  const path = "/root/dir";

  expect(Radar._getRelativePath(path, `${path}/test.txt`)).toStrictEqual("test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir2/test.txt`)).toStrictEqual("dir2/test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir3/dir4/test.txt`)).toStrictEqual("dir3/dir4/test.txt");
});

test("absolute path replacement - trailing slash(es)", () => {
  const path = "/root/dir////";

  expect(Radar._getRelativePath(path, `${path}/test.txt`)).toStrictEqual("test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir2/test.txt`)).toStrictEqual("dir2/test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir3/dir4/test.txt`)).toStrictEqual("dir3/dir4/test.txt");
});

test("file name exclusion", () => {
  // passing name, passing ext
  let config = new Config();
  let radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "goodext")).toBe(false);

  // failing name, passing ext
  config = new Config();
  config.setExcludedFiles(["badfile"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("badfile", "goodext")).toBe(true);

  // passing name, failing ext
  config = new Config();
  config.setExcludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "badext")).toBe(true);

  // failing name, failing ext
  config = new Config();
  config.setExcludedFiles(["badfile"]);
  config.setExcludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("badfile", "badext")).toBe(true);
});

test("file size exclusion", () => {
  // passing name, passing ext
  let config = new Config();
  config.setMaxFileSizeMiB(1);
  const radar1 = new Radar(config);
  expect(radar1._isFileTooLarge(1048575)).toBe(false);
  expect(radar1._isFileTooLarge(1048576)).toBe(false);
  expect(radar1._isFileTooLarge(1048577)).toBe(true);

  const radar2 = new Radar();
  expect(radar2._isFileTooLarge(10485759)).toBe(false);
  expect(radar2._isFileTooLarge(10485760)).toBe(false);
  expect(radar2._isFileTooLarge(10485761)).toBe(true);
});
