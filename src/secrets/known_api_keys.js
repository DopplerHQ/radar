const Secret = require('../Secret');

class KnownAPIKeys extends Secret {
  constructor() {
    const name = 'known_api_key';
    super(name);

    this.dopplerRegex = /(^|\W)dplr_[a-zA-Z0-9]{40}/;
    // AWS access keys and STS keys (https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-unique-ids)
    this.awsRegex = /(^|\W)A(K|S)IA[A-Z0-9]{8,}/;
    this.mailgunRegex = /(^|\W)key-[a-z0-9]{32}/;
    this.sendgridRegex = /(^|\W)SG\.[a-zA-Z0-9.\-_]{32,}/;
    // https://api.slack.com/docs/token-types
    this.slackRegex = /(^|\W)xox(a-2|b|p|r)-[a-zA-Z0-9\-]{16,}/;
    this.slackWebhookRegex = /(^|\W)https:\/\/hooks\.slack\.com\/T[a-zA-Z0-9]+\/B[a-zA-Z0-9]+\/[a-zA-Z0-9]+/;
    this.stripeRegex = /(^|\W)sk_(test|live)_[a-zA-Z0-9]+/;
    this.stripeWebhookRegex = /(^|\W)whsec_[a-zA-Z0-9]+/;
    this.mailchimpRegex = /(^|\W)[a-z0-9]{32}-[a-z0-9]{3,}/;
    this.sqreenRegex = /(^|\W)org_[a-z0-9]{60}/;
    this.squareRegex = /(^|\W)EAAAE[a-zA-Z0-9\-_]{32,}/;
    this.asanaRegex = /(^|\W)0\/[a-z0-9]{32}/;
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
        services: [],
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
    if (this.dopplerRegex.test(term)) {
      return "doppler";
    }
    if (this.awsRegex.test(term)) {
      return "aws";
    }
    if (this.mailgunRegex.test(term)) {
      return "mailgun";
    }
    if (this.sendgridRegex.test(term)) {
      return "sendgrid";
    }
    if (this.slackRegex.test(term)) {
      return "slack";
    }
    if (this.slackWebhookRegex.test(term)) {
      return "slack-webhook";
    }
    if (this.stripeRegex.test(term)) {
      return "stripe";
    }
    if (this.stripeWebhookRegex.test(term)) {
      return "stripe-webhook";
    }
    if (this.mailchimpRegex.test(term)) {
      return "mailchimp";
    }
    if (this.sqreenRegex.test(term)) {
      return "sqreen";
    }
    if (this.squareRegex.test(term)) {
      return "square";
    }
    if (this.asanaRegex.test(term)) {
      return "asana";
    }

    return null;
  }
}

const knownAPIKeys = new KnownAPIKeys();
module.exports = knownAPIKeys;
