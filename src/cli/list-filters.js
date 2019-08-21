const program = require('commander');
const Table = require('easy-table');

const Radar = require('../radar');

const printFilters = (filters, json = false) => {
  if (json) {
    console.log(JSON.stringify(filters, null, 2));
    return;
  }

  const table = new Table();
  filters.forEach((filter) => {
    table.cell('Filter', filter);
    table.newRow();
  })
  console.log(table.toString());
};

program
  .name("filters")
  .description("Print all available filters")
  .option("--json", "Output results as json blob")
  .action(() => {
    if (program.rawArgs.includes("--help")) {
      program.help();
      return;
    }

    const { json } = program.opts();
    printFilters((new Radar()).listFilters(), json);
  })
  .parse(process.argv);
