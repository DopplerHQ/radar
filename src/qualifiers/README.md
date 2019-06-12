Qualifiers are used to detect the likelihood that a term is an API key, a static secret, or some other value that should probably not be hardcoded (email address, url, etc.). They are also useful for disqualifying terms and patterns that frequently produce false positives.

Each qualifier has four components:
- `matchScore`: a function that returns how strongly the term matches the qualifier. The return value will be a number between 0 and 1, with 1 representing a strong match and 0 representing a strong mismatch
- `name`: the name of the qualifier
- `weight`: an integer representing the extent to which a match should factor in to classifying the term as a secret
- `negativeWeight`: an integer representing the extent to which a *mismatch* should count against classifying the term as a secret. Exceptionally large values can be used to completely disqualify a term for not matching a specific filter. For an example of this, see `excludepaths.js`
