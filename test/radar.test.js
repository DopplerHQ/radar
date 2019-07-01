const Radar = require('../src/radar');
const Config = require('../src/config');
const File = require('../src/objects/file');
const ScannedFile = require('../src/objects/scannedfile');

test("relative path - no trailing slash", () => {
  const path = "/root/dir";

  expect(Radar._getRelativePath(path, `${path}/test.txt`)).toStrictEqual("test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir2/test.txt`)).toStrictEqual("dir2/test.txt");
  expect(Radar._getRelativePath(path, `${path}/dir3/dir4/test.txt`)).toStrictEqual("dir3/dir4/test.txt");
});

test("relative path - trailing slash(es)", () => {
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

test("results map", () => {
  const path = "/root"
  const scannedFile1 = new ScannedFile(new File("test.txt", path, 123));
  const scannedFile2 = new ScannedFile(new File("anothertest.ext", path, 456));
  const scanResults = [scannedFile1, scannedFile2];

  expect(Radar._getResultsMap(path, scanResults)).toStrictEqual(
    {
      "test.txt": {
        metadata: {
          fileSize: 123,
          fileExtension: "txt",
        },
        keys: [],
      },
      "anothertest.ext": {
        metadata: {
          fileSize: 456,
          fileExtension: "ext",
        },
        keys: [],
      },
    }
  );
});
