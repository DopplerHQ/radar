const Secret = require('../Secret');
const Services = require('../objects/known_api_services');

class KnownAPIKeys extends Secret {
  constructor() {
    const name = 'known_api_key';
    super(name);

    this.dopplerRegexOld = /(^|\W)dplr_[a-zA-Z0-9]{40}($|\W)/;
    this.dopplerRegex = /(^|\W)DP\.[a-zA-Z0-9]{40}($|\W)/;
    // AWS access keys and STS keys (https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-unique-ids)
    this.awsRegex = /(^|\W)A(K|S)IA[A-Z0-9]{8,}/;
    this.mailgunRegex = /(^|\W)key-[a-z0-9]{32}($|\W)/;
    this.sendgridRegex = /(^|\W)SG\.[a-zA-Z0-9.\-_]{32,}/;
    // https://api.slack.com/docs/token-types
    this.slackRegex = /(^|\W)xox(a-2|b|p|r)-[a-zA-Z0-9\-]{16,}/;
    this.slackWebhookRegex = /(^|\W)https:\/\/hooks\.slack\.com\/T[a-zA-Z0-9]+\/B[a-zA-Z0-9]+\/[a-zA-Z0-9]+/;
    this.stripeRegex = /(^|\W)sk_(test|live)_[a-zA-Z0-9]+/;
    this.stripeWebhookRegex = /(^|\W)whsec_[a-zA-Z0-9]+/;
    this.mailchimpRegex = /(^|\W)[a-z0-9]{32}-[a-z0-9]{3,}/;
    this.sqreenRegex = /(^|\W)org_[a-z0-9]{60}($|\W)/;
    this.squareRegex = /(^|\W)EAAAE[a-zA-Z0-9\-_]{32,}/;
    this.asanaRegex = /(^|\W)0\/[a-z0-9]{32}($|\W)/;
    this.vaultServiceTokenRegex = /(^|\W)s\.[a-zA-Z0-9]{24}($|\W)/;
  }

  check(terms) {
    const secrets = terms.map(term => ({
      term,
      service: this.matchKnownService(term),
    }))
      .filter(({ service }) => service !== null);

    if (secrets.length === 0) {
      return {
        secrets: [],
        metadata: {},
      };
    }

    return {
      secrets: secrets.map(({ term }) => term),
      metadata: {
        services: secrets.map(({ service }) => service)
      },
    };
  }

  matchKnownService(term) {
    if (this.dopplerRegexOld.test(term) || this.dopplerRegex.test(term)) {
      return Services.DOPPLER;
    }
    if (this.awsRegex.test(term)) {
      return Services.AWS;
    }
    if (this.mailgunRegex.test(term)) {
      return Services.MAILGUN;
    }
    if (this.sendgridRegex.test(term)) {
      return Services.SENDGRID;
    }
    if (this.slackRegex.test(term)) {
      return Services.SLACK;
    }
    if (this.slackWebhookRegex.test(term)) {
      return Services.SLACK_WEBHOOK;
    }
    if (this.stripeRegex.test(term)) {
      return Services.STRIPE;
    }
    if (this.stripeWebhookRegex.test(term)) {
      return Services.STRIPE_WEBHOOK;
    }
    if (this.mailchimpRegex.test(term)) {
      return Services.MAILCHIMP;
    }
    if (this.sqreenRegex.test(term)) {
      return Services.SQREEN;
    }
    if (this.squareRegex.test(term)) {
      return Services.SQUARE;
    }
    if (this.asanaRegex.test(term)) {
      return Services.ASANA;
    }
    if (this.vaultServiceTokenRegex.test(term)) {
      return Services.HASHICORP_VAULT;
    }

    return null;
  }
}

const knownAPIKeys = new KnownAPIKeys();
module.exports = knownAPIKeys;
