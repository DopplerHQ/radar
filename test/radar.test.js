const { Radar, Config } = require('../src/radar');
const File = require('../src/objects/file');
const ScannedFile = require('../src/objects/scannedfile');

test("file exclusion- all possible states", () => {
  // no white/blacklist
  let config = new Config();
  let radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "goodext")).toBe(false);

  // whitelisted name
  config = new Config();
  config.setIncludedFiles(["badfile"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("badfile", "goodext")).toBe(false);

  // blacklisted name
  config = new Config();
  config.setExcludedFiles(["badfile"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("badfile", "goodext")).toBe(true);

  // whitelisted ext
  config = new Config();
  config.setIncludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "badext")).toBe(false);

  // blacklisted ext
  config = new Config();
  config.setExcludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "badext")).toBe(true);

  // whitelisted name, blacklisted ext
  config = new Config();
  config.setIncludedFiles(["goodfile"]);
  config.setExcludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "badext")).toBe(false);

  // blacklisted name, whitelisted ext
  config = new Config();
  config.setExcludedFiles(["badfile"]);
  config.setIncludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("badfile", "badext")).toBe(true);

  // whitelisted name, whitelisted ext
  config = new Config();
  config.setIncludedFiles(["goodfile"]);
  config.setIncludedFileExts(["goodext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "goodext")).toBe(false);

  // whitelisted name, blacklisted name
  config = new Config();
  config.setIncludedFiles(["goodfile"]);
  config.setExcludedFiles(["goodfile"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "badext")).toBe(false);

  // whitelisted ext, blacklisted ext
  config = new Config();
  config.setIncludedFileExts(["goodext"]);
  config.setExcludedFileExts(["goodext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("goodfile", "goodext")).toBe(false);

  // blacklisted name, blacklisted ext
  config = new Config();
  config.setExcludedFiles(["badfile"]);
  config.setExcludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._isFileExcluded("badfile", "badext")).toBe(true);
});

test("file exclusion- relative paths", () => {
  let config = new Config();
  let radar = new Radar(config);
  radar.basePath = "/root";
  config.setExcludedFiles(["nested/directory/test.txt"]);
  expect(radar._isFileExcluded("test", "txt", "nested/directory/test.txt")).toBe(true);

  expect(radar._isFileExcluded("test", "txt", "fake/nested/directory")).toBe(false);
  expect(radar._isFileExcluded("test", "txt", "")).toBe(false);
});

test("directory exclusion - all possible states", () => {
  // no white/blacklist
  let config = new Config();
  let radar = new Radar(config);
  expect(radar._isDirectoryExcluded("gooddir")).toBe(false);

  // whitelisted
  config = new Config();
  config.setIncludedDirectories(["baddir"]);
  radar = new Radar(config);
  expect(radar._isDirectoryExcluded("baddir")).toBe(false);

  // blacklisted
  config = new Config();
  config.setExcludedDirectories(["baddir"]);
  radar = new Radar(config);
  expect(radar._isDirectoryExcluded("baddir")).toBe(true);

  // whitelisted and blacklisted
  config = new Config();
  config.setIncludedDirectories(["baddir"]);
  config.setExcludedDirectories(["baddir"]);
  radar = new Radar(config);
  expect(radar._isDirectoryExcluded("baddir")).toBe(false);
});

test("directory exclusion- relative paths", () => {
  let config = new Config();
  let radar = new Radar(config);
  radar.basePath = "/root";
  config.setExcludedDirectories(["nested/directory"]);
  expect(radar._isDirectoryExcluded("test", "nested/directory/test")).toBe(true);
  expect(radar._isDirectoryExcluded("test", "nested/directory/test1/test2/test")).toBe(true);

  expect(radar._isDirectoryExcluded("test", "nested/differentdirectory/test")).toBe(false);
  expect(radar._isDirectoryExcluded("test", "")).toBe(false);
  expect(radar._isDirectoryExcluded("test", "/")).toBe(false);
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
        secrets: [],
      },
      "anothertest.ext": {
        metadata: {
          fileSize: 456,
          fileExtension: "ext",
        },
        secrets: [],
      },
    }
  );
});
