const Filter = require('../objects/Filter');

class KnownAPIKey extends Filter {
  constructor() {
    super('Known API Key');
    // TODO separate webhook secret type?

    this.dopplerRegex = /(^|\W)dplr_[a-zA-Z0-9]{40}/;

    // AWS access keys and STS keys (https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-unique-ids)
    this.awsRegex = /(^|\W)A(K|S)IA[A-Z0-9]+/;
    this.mailgunRegex = /(^|\W)key-[a-z0-9]{32}/;
    this.sendgridRegex = /(^|\W)SG\.[a-zA-Z0-9\.-_]{32,}/;
    // https://api.slack.com/docs/token-types
    this.slackRegex = /(^|\W)xox(a-2|b|p|r)-[a-zA-Z0-9-]{16,}/;
    this.slackWebhookRegex = /(^|\W)https:\/\/hooks\.slack\.com\/T[a-zA-Z0-9]+\/B[a-zA-Z0-9]+\/[a-zA-Z0-9]+/;
    this.stripeRegex = /(^|\W)sk_(test|live)_[a-zA-Z0-9]+/;
    this.stripeWebhookRegex = /(^|\W)whsec_[a-zA-Z0-9]+/;
    this.mailchimpRegex = /(^|\W)[a-z0-9]{32}-[a-z0-9]{3,}/;
    this.sqreenRegex = /(^|\W)org_[a-z0-9]{60}/;
    this.squareRegex = /(^|\W)EAAAE[a-zA-Z0-9-_]{32,}/;
    this.asanaRegex = /(^|\W)0\/[a-z0-9]{32}/;
  }

  isMatch(term) {
        if (this.dopplerRegex.test(term)) return true;
        if (this.awsRegex.test(term)) return true;
        if (this.mailgunRegex.test(term)) return true;
        if (this.sendgridRegex.test(term)) return true;
        if (this.slackRegex.test(term)) return true;
        if (this.slackWebhookRegex.test(term)) return true;
        if (this.stripeRegex.test(term)) return true;
        if (this.stripeWebhookRegex.test(term)) return true;
        if (this.mailchimpRegex.test(term)) return true;
        if (this.sqreenRegex.test(term)) return true;
        if (this.squareRegex.test(term)) return true;
        if (this.asanaRegex.test(term)) return true;
        return false;
  }
}

const filter = new KnownAPIKey();
module.exports = filter;
