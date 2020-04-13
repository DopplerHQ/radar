const Secret = require('../Secret');

class CustomTerms extends Secret {
  constructor() {
    const name = 'custom_pattern';
    super(name);

    this.customTerms = global.customPatterns.map(pattern => new RegExp(pattern, 'g'))
  }

  check(terms) {
    if (this.customTerms.length === 0) {
      return {
        secrets: [],
        metadata: {},
      };
    }

    const secrets = terms.map(term => {
      for (const customTerm of this.customTerms) {
        const match = (term.match(customTerm) || [])
        if (match.length > 0) {
          return match[0]
        }
      }
      return null
    }).filter(t => t !== null)

    return {
      secrets,
      metadata: {},
    };
  }

  getTerms(line) {
    return [line]
  }

  shouldScan() {
    return true
  }
}

const customTerms = new CustomTerms();
module.exports = customTerms;
