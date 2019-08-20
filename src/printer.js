const Table = require('easy-table');

class RadarPrinter {
  static printScanResults(results, json = false) {
    if (json) {
      console.dir(results, { depth: 5 } );
      return;
    }

    if (Object.keys(results).length === 0) {
      console.log("No secrets detected");
      return;
    }

    // print results table
    const resultsArr = [];
    Object.keys(results).forEach((file) => {
      results[file].lines.forEach((line, lineNumber) => {
        line.findings.forEach((finding, findingNumber) => resultsArr.push({
          File: (lineNumber === 0 && findingNumber === 0) ? file : "",
          Line: line.lineNumber,
          Secret: finding.text,
          Type: finding.type,
        }))
      })
    });
    console.log(Table.print(resultsArr));
  }

  static printSecretTypes(secretTypes, json = false) {
    if (json) {
      console.log(secretTypes);
      return;
    }

    const table = new Table();
    secretTypes.forEach((type) => {
      table.cell('Secret Type', type);
      table.newRow();
    })
    console.log(table.toString());
  }

  static printFilters(filters, json = false) {
    if (json) {
      console.log(filters);
      return;
    }

    const table = new Table();
    filters.forEach((filter) => {
      table.cell('Filter', filter);
      table.newRow();
    })
    console.log(table.toString());
  }

  static printDefaults(config, json = false) {
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
  }
}

module.exports = RadarPrinter;
