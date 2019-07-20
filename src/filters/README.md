Filters are used to calculate the likelihood that a term is an API key, database url, or other sensitive secret

Each filter exports two properties:
- `name`: (string) the name, possibly for display purposes
- `checkMatch`: (function) calculates the strength/score of a potential match. The return value will be an object with two properties: 1) `score`: a number between 0 and 1, with 1 representing a strong match and 0 representing a strong mismatch 2) `weight`: an integer representing the extent to which a (mis)match should affect the final score. this can be 0
