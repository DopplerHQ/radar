const program = require('commander');
const Table = require('easy-table');

const Radar = require('../radar');

const printSecretTypes = (secretTypes, json = false) => {
  if (json) {
    console.log(JSON.stringify(secretTypes, null, 2));
    return;
  }

  const table = new Table();
  secretTypes.forEach((type) => {
    table.cell('Secret Type', type);
    table.newRow();
  })
  console.log(table.toString());
};

program
  .name("secrets")
  .description("Print all available secret types")
  .option("--json", "Output results as json blob")
  .action(() => {
    if (program.rawArgs.includes("--help")) {
      program.help();
      return;
    }

    const { json } = program.opts();
    printSecretTypes((new Radar()).listSecretTypes(), json);
  })
  .parse(process.argv);
