Filters are used to calculate the likelihood that a term is an API key, database url, or other sensitive secret

Each filter exports four properties:
- `checkMatch`: (function) calculates the strength/score of a potential match. The return value will be a number between 0 and 1, with 1 representing a strong match and 0 representing a strong mismatch
- `name`: the name, possibly for display purposes
- `weight`: (integer)  the extent to which a match should affect the final score
- `negativeWeight`: (integer) the extent to which a mismatch should affect the final score
