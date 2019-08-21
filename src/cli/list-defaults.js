const program = require('commander');
const Table = require('easy-table');

const Radar = require('../radar');
const util = require('./util');

const printDefaults = (config, json = false, names = false) => {
  if (json) {
    if (names) {
      console.log(Object.keys(config));
    }
    else {
      console.log(config);
    }
    return;
  }

  if (Object.keys(config).length === 0) {
    console.log("Config value not found");
    return;
  }

  const table = new Table();
  Object.keys(config).forEach((key) => {
    table.cell('Key', key);
    if (!names) {
      table.cell('Value', config[key]);
    }
    table.newRow();
  })
  console.log(table.toString());
};

program
  .name("defaults")
  .arguments("[name]")
  .description("Print the default configuration\n\nTakes an optional [name] argument to fetch a single config value")
  .option("--names", "Only print config value names, don't print the values")
  .option("--exclude <list>", "Config values to exclude")
  .option("--json", "Output results as json blob")
  .action((...params) => {
    if (program.rawArgs.includes("--help")) {
      program.help();
      return;
    }

    const args = util.getCommandArgs(params);
    const name = args[0];
    const { json, exclude, names } = program.opts();
    let defaultConfig = (new Radar()).config();
    if (name === undefined) {
      if (exclude !== undefined) {
        const excludeConfigValues = util.parseStringArray(exclude);
        excludeConfigValues.forEach((name) => {
          delete defaultConfig[name];
        });
      }
      printDefaults(defaultConfig, json, names);
    }
    else {
      const config = (defaultConfig[name] === undefined) ? {} : { [name]: defaultConfig[name] };
      printDefaults(config, json);
    }
  })
  .parse(process.argv);
