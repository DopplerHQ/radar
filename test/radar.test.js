const Radar = require('../src/radar');
const File = require('../src/objects/file');
const ScannedFile = require('../src/objects/scannedfile');

test("file exclusion- all possible states", async () => {
  // no white/blacklist
  let config = {};
  let radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("goodfile.goodext", "", 0))).toBe(true);

  // whitelisted name
  config = { includedFiles: ["badfile.*"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("badfile.goodext", "", 0))).toBe(true);

  // blacklisted name
  config = { excludedFiles: ["badfile.*"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("badfile.goodext", "", 0))).toBe(false);

  // whitelisted ext
  config = { includedFileExts: [".badext"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("goodfile.badext", "", 0))).toBe(true);

  // blacklisted ext
  config = { excludedFileExts: [".badext"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("goodfile.badext", "", 0))).toBe(false);

  // whitelisted name, blacklisted ext
  config = { excludedFileExts: [".badext"], includedFiles: ["goodfile.*"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("goodfile.badext", "", 0))).toBe(true);

  // blacklisted name, whitelisted ext
  config = { excludedFiles: ["badfile.*"], includedFileExts: [".badext"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("badfile.badext", "", 0))).toBe(false);

  // whitelisted name, whitelisted ext
  config = { includedFileExts: [".goodext"], includedFiles: ["goodfile.*"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("goodfile.goodext", "", 0))).toBe(true);

  // whitelisted name, blacklisted name
  config = { excludedFiles: ["goodfile.*"], includedFiles: ["goodfile.*"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("goodfile.badext", "", 0))).toBe(true);

  // whitelisted ext, blacklisted ext
  config = { includedFileExts: [".goodext"], excludedFileExts: [".goodext"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("goodfile.goodext", "", 0))).toBe(true);

  // blacklisted name, blacklisted ext
  config = { excludedFiles: ["badfile.*"], excludedFileExts: [".badext"] };
  radar = new Radar(config);
  expect(radar._shouldScanFile(await Radar._getFileObject("badfile.badext", "", 0))).toBe(false);
});

test("filename exclusion", () => {
  const excludedFiles = ["tester/one/file.txt1"];

  expect(Radar._isNameBlacklisted("file.txt1", "", excludedFiles)).toBe(false);
  expect(Radar._isNameBlacklisted("file.txt1", "one/file.txt1", excludedFiles)).toBe(false);
  expect(Radar._isNameBlacklisted("file.txt1", "tester/one/file.txt1", excludedFiles)).toBe(true);
  expect(Radar._isNameBlacklisted("file.txt1", "/tester/one/file.txt1", excludedFiles)).toBe(false);
  expect(Radar._isNameBlacklisted("file.txt1", "another/tester/one/file.txt1", excludedFiles)).toBe(false);
})

test("default file exclusions", () => {
  const radar = new Radar();
  const excludedFiles = radar.config().getExcludedFiles();
  // test default "package-lock.json" exclusion
  expect(Radar._isNameBlacklisted("package-lock.json", "", excludedFiles)).toBe(true);
  expect(Radar._isNameBlacklisted("package-lock.json", "src/package-lock.json", excludedFiles)).toBe(true);
  expect(Radar._isNameBlacklisted("package-lock.json", "src/dir/package-lock.json", excludedFiles)).toBe(true);
});

test("default directory exclusions", () => {
  const radar = new Radar();
  const excludedDirectories = radar.config().getExcludedDirectories();
  // test default "node_modules" exclusion
  expect(Radar._isDirectoryBlacklisted("node_modules", "", excludedDirectories)).toBe(true);
  expect(Radar._isDirectoryBlacklisted("node_modules", "src/node_modules", excludedDirectories)).toBe(true);
  expect(Radar._isDirectoryBlacklisted("node_modules", "src/dir/node_modules", excludedDirectories)).toBe(true);

  // this dir shouldn't be explicitly excluded. rather, it'll never even be known about because its parent is excluded
  expect(Radar._isDirectoryBlacklisted("tester", "src/dir/node_modules/tester", excludedDirectories)).toBe(false);
});

test("directory exclusion", () => {
  const excludedDirectories = ["tester/**/*"];

  expect(Radar._isDirectoryBlacklisted("tester", "tester", excludedDirectories)).toBe(false);
  expect(Radar._isDirectoryBlacklisted("file.txt", "tester/file.txt", excludedDirectories)).toBe(true);
  expect(Radar._isDirectoryBlacklisted("one", "tester/one", excludedDirectories)).toBe(true);
  expect(Radar._isDirectoryBlacklisted("two", "tester/one/two", excludedDirectories)).toBe(true);
  expect(Radar._isDirectoryBlacklisted("file.txt", "tester/one/two/file.txt", excludedDirectories)).toBe(true);
  expect(Radar._isDirectoryBlacklisted("file.txt", "/tester/one/two/file.txt", excludedDirectories)).toBe(false);
  expect(Radar._isDirectoryBlacklisted("file.txt", "another/tester/one/two/file.txt", excludedDirectories)).toBe(false);
})

test("file extensions", () => {
  expect(Radar._isExtensionWhitelisted("badext", [])).toBe(false);
  expect(Radar._isExtensionBlacklisted("badext", [])).toBe(false);

  let excludedFileExts = [".badext"];
  expect(Radar._isExtensionBlacklisted(".badext", excludedFileExts)).toBe(true);
  expect(Radar._isExtensionBlacklisted(".badext.js", excludedFileExts)).toBe(false);
  expect(Radar._isExtensionBlacklisted(".js.badext", excludedFileExts)).toBe(false);

  excludedFileExts = [".badext*"];
  expect(Radar._isExtensionBlacklisted(".badext1", excludedFileExts)).toBe(true);
  expect(Radar._isExtensionBlacklisted(".badext1.js", excludedFileExts)).toBe(true);
  expect(Radar._isExtensionBlacklisted(".js.badext1", excludedFileExts)).toBe(false);

  excludedFileExts = [".*badext*"];
  expect(Radar._isExtensionBlacklisted(".badext1", excludedFileExts)).toBe(true);
  expect(Radar._isExtensionBlacklisted(".badext1.js", excludedFileExts)).toBe(true);
  expect(Radar._isExtensionBlacklisted(".js.badext1", excludedFileExts)).toBe(true);
});

test("file extension- leading period is necessary", () => {
  let radar = new Radar();
  let excludedFileExts = radar.config().getExcludedFileExts();
  expect(Radar._isExtensionBlacklisted(".png", excludedFileExts)).toBe(true);
  expect(Radar._isExtensionBlacklisted("png", excludedFileExts)).toBe(false);

  excludedFileExts = [".badext"];
  expect(Radar._isExtensionBlacklisted(".badext", excludedFileExts)).toBe(true);
  expect(Radar._isExtensionBlacklisted("badext", excludedFileExts)).toBe(false);
});

test("file exclusion- relative paths", async () => {
  let config = { excludedFiles: ["nested/directory/testname.testext"] };
  let radar = new Radar(config);
  radar.basePath = "/root";
  expect(radar._shouldScanFile(await Radar._getFileObject("nested/directory/testname.testext", "", 0))).toBe(false);
  expect(radar._shouldScanFile(await Radar._getFileObject("fake/nested/directory/testname.testext", "", 0))).toBe(true);
  expect(radar._shouldScanFile(await Radar._getFileObject("testname.testext", "", 0))).toBe(true);
});

test("file excluse- size", async () => {
  let radar = new Radar();
  expect(radar._shouldScanFile(await Radar._getFileObject("testname.testext", "", 1))).toBe(true);
  expect(radar._shouldScanFile(await Radar._getFileObject("testname.testext", "", Number.MAX_SAFE_INTEGER))).toBe(false);
});

test("directory exclusion - all possible states", () => {
  // no white/blacklist
  let config = {};
  let radar = new Radar(config);
  expect(radar._checkDirectory("gooddir")).toBe(true);

  // whitelisted
  config = { includedDirectories: ["gooddir"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("gooddir")).toBe(true);
  expect(radar._checkDirectory("tester.gooddir")).toBe(true);

  // blacklisted
  config = { excludedDirectories: ["baddir"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("baddir")).toBe(false);
  expect(radar._checkDirectory("tester.baddir")).toBe(true);

  // whitelisted and blacklisted
  config = { includedDirectories: ["baddir"], excludedDirectories: ["baddir"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("baddir")).toBe(true);
});

test("directory exclusion- relative paths", () => {
  let config = { excludedDirectories: ["nested/directory/**/*"] };
  let radar = new Radar(config);
  radar.basePath = "/root";
  expect(radar._checkDirectory("directory", "nested/directory")).toBe(true);
  expect(radar._checkDirectory("subdir", "nested/directory/subdir")).toBe(false);
  expect(radar._checkDirectory("subdir3", "nested/directory/subdir1/subdir2/subdir3")).toBe(false);

  expect(radar._checkDirectory("tester", "")).toBe(true);
  expect(radar._checkDirectory("tester", "/")).toBe(true);

  // explicit inclusion overrides wildcard exclusion
  config = { includedDirectories: ["nested/directory/one"], excludedDirectories: ["nested/directory/**/*"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("one", "nested/directory/one")).toBe(true);
  expect(radar._checkDirectory("two", "nested/directory/two")).toBe(false);

  // wildcard inclusion also overrides explicit exclusion (inclusion always overrides exclusion)
  config = { includedDirectories: ["nested/directory/**/*"], excludedDirectories: ["nested/directory/two"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("two", "nested/directory/two")).toBe(true);
});

test("file size exclusion", () => {
  const oneMiB = 1048576;
  let config = { maxFileSizeMiB: 1 };
  let radar = new Radar(config);
  expect(radar._checkFileSize(oneMiB - 1)).toBe(true);
  expect(radar._checkFileSize(oneMiB)).toBe(true);
  expect(radar._checkFileSize(oneMiB + 1)).toBe(false);

  const tenMiB = oneMiB * 10;
  config = { maxFileSizeMiB: 10 };
  radar = new Radar(config);
  expect(radar._checkFileSize(tenMiB - 1)).toBe(true);
  expect(radar._checkFileSize(tenMiB)).toBe(true);
  expect(radar._checkFileSize(tenMiB + 1)).toBe(false);
});

test("results map", () => {
  const path = "/root"
  const scannedFile1 = new ScannedFile(new File("tester.txt", path, path, 123));
  scannedFile1.addSecret("one", "one", "one", 0);
  const scannedFile2 = new ScannedFile(new File("anothertest.ext", path, path, 456));
  scannedFile2.addSecret("two", "two", "two", 0);
  const scanResults = [scannedFile1, scannedFile2];

  expect(Radar._getResultsMap(path, scanResults)).toStrictEqual(
    {
      "tester.txt": {
        metadata: {
          size: 123,
          extension: ".txt",
          numLines: 0,
        },
        lines: [
          {
            line: "one",
            lineNumber: 0,
            findings: [
              {
                metadata: {},
                text: "one",
                type: "one",
              }
            ]
          }
        ],
      },
      "anothertest.ext": {
        metadata: {
          size: 456,
          extension: ".ext",
          numLines: 0,
        },
        lines: [
          {
            line: "two",
            lineNumber: 0,
            findings: [
              {
                metadata: {},
                text: "two",
                type: "two",
              }
            ]
          }
        ],
      },
    }
  );
});
