const { Radar, Config } = require('../src/radar');
const File = require('../src/objects/file');
const ScannedFile = require('../src/objects/scannedfile');

test("file exclusion- all possible states", () => {
  // no white/blacklist
  let config = new Config();
  let radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "goodext")).toBe(true);

  // whitelisted name
  config = new Config();
  config.setIncludedFiles(["badfile"]);
  radar = new Radar(config);
  expect(radar._checkFileName("badfile", "goodext")).toBe(true);

  // blacklisted name
  config = new Config();
  config.setExcludedFiles(["badfile"]);
  radar = new Radar(config);
  expect(radar._checkFileName("badfile", "goodext")).toBe(false);

  // whitelisted ext
  config = new Config();
  config.setIncludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "badext")).toBe(true);

  // blacklisted ext
  config = new Config();
  config.setExcludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "badext")).toBe(false);

  // whitelisted name, blacklisted ext
  config = new Config();
  config.setIncludedFiles(["goodfile"]);
  config.setExcludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "badext")).toBe(true);

  // blacklisted name, whitelisted ext
  config = new Config();
  config.setExcludedFiles(["badfile"]);
  config.setIncludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._checkFileName("badfile", "badext")).toBe(false);

  // whitelisted name, whitelisted ext
  config = new Config();
  config.setIncludedFiles(["goodfile"]);
  config.setIncludedFileExts(["goodext"]);
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "goodext")).toBe(true);

  // whitelisted name, blacklisted name
  config = new Config();
  config.setIncludedFiles(["goodfile"]);
  config.setExcludedFiles(["goodfile"]);
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "badext")).toBe(true);

  // whitelisted ext, blacklisted ext
  config = new Config();
  config.setIncludedFileExts(["goodext"]);
  config.setExcludedFileExts(["goodext"]);
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "goodext")).toBe(true);

  // blacklisted name, blacklisted ext
  config = new Config();
  config.setExcludedFiles(["badfile"]);
  config.setExcludedFileExts(["badext"]);
  radar = new Radar(config);
  expect(radar._checkFileName("badfile", "badext")).toBe(false);
});

test("file exclusion- relative paths", () => {
  let config = new Config();
  let radar = new Radar(config);
  radar.basePath = "/root";
  config.setExcludedFiles(["nested/directory/testname.testext"]);
  expect(radar._checkFileName("testname", "testext", "nested/directory/testname.testext")).toBe(false);
  expect(radar._checkFileName("testname", "testext", "fake/nested/directory")).toBe(true);
  expect(radar._checkFileName("testname", "testext", "")).toBe(true);
});

test("directory exclusion - all possible states", () => {
  // no white/blacklist
  let config = new Config();
  let radar = new Radar(config);
  expect(radar._checkDirectory("gooddir")).toBe(true);

  // whitelisted
  config = new Config();
  config.setIncludedDirectories(["baddir"]);
  radar = new Radar(config);
  expect(radar._checkDirectory("baddir")).toBe(true);

  // blacklisted
  config = new Config();
  config.setExcludedDirectories(["baddir"]);
  radar = new Radar(config);
  expect(radar._checkDirectory("baddir")).toBe(false);

  // whitelisted and blacklisted
  config = new Config();
  config.setIncludedDirectories(["baddir"]);
  config.setExcludedDirectories(["baddir"]);
  radar = new Radar(config);
  expect(radar._checkDirectory("baddir")).toBe(true);
});

test("directory exclusion- relative paths", () => {
  let config = new Config();
  let radar = new Radar(config);
  radar.basePath = "/root";
  config.setExcludedDirectories(["nested/directory"]);
  expect(radar._checkDirectory("test", "nested/directory/test")).toBe(false);
  expect(radar._checkDirectory("test", "nested/directory/test1/test2/test")).toBe(false);

  expect(radar._checkDirectory("test", "nested/differentdirectory/test")).toBe(true);
  expect(radar._checkDirectory("test", "")).toBe(true);
  expect(radar._checkDirectory("test", "/")).toBe(true);
});

test("file size exclusion", () => {
  // passing name, passing ext
  let config = new Config();
  config.setMaxFileSizeMiB(1);
  const radar1 = new Radar(config);
  expect(radar1._checkFileSize(1048575)).toBe(true);
  expect(radar1._checkFileSize(1048576)).toBe(true);
  expect(radar1._checkFileSize(1048577)).toBe(false);

  const radar2 = new Radar();
  expect(radar2._checkFileSize(10485759)).toBe(true);
  expect(radar2._checkFileSize(10485760)).toBe(true);
  expect(radar2._checkFileSize(10485761)).toBe(false);
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
          size: 123,
          extension: "txt",
        },
        results: [],
      },
      "anothertest.ext": {
        metadata: {
          size: 456,
          extension: "ext",
        },
        results: [],
      },
    }
  );
});
