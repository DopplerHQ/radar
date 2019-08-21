const program = require('commander');
const Table = require('easy-table');

const Radar = require('../radar');

const printDefaults = (config, json = false) => {
  if (json) {
    console.log(config);
    return;
  }

  const table = new Table();
  Object.keys(config).forEach((key) => {
    table.cell('Key', key);
    table.cell('Value', config[key]);
    table.newRow();
  })
  console.log(table.toString());
};

program
  .description("Print the default configuration")
  .name("defaults")
  .option("--json", "Output results as json blob")
  .action(() => {
    const { json } = program.opts();
    printDefaults((new Radar()).config(), json);
  })
  .parse(process.argv);
