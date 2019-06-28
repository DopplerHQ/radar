const Scanner = require("../src/scanner");
const FilterWeights = require("../src/objects/filterweights");

test('confidence calculation- positive weights', () => {
  const scores = [
    {
      name: "filter1",
      weight: FilterWeights.HIGH,
      score: .9,
    }
  ];
  let confidence = (FilterWeights.HIGH * .9) / FilterWeights.HIGH;
  expect(Scanner.calculateConfidence(scores)).toStrictEqual(confidence);

  scores.push({
    name: "filter2",
    weight: FilterWeights.MEDIUM,
    score: .75,
  });
  confidence = ((FilterWeights.HIGH * .9) + (FilterWeights.MEDIUM * .75)) / (FilterWeights.HIGH + FilterWeights.MEDIUM);
  expect(Scanner.calculateConfidence(scores)).toStrictEqual(confidence);

  scores.push({
    name: "filter3",
    weight: FilterWeights.LOW,
    score: .5,
  });
  confidence = ((FilterWeights.HIGH * .9) + (FilterWeights.MEDIUM * .75) + (FilterWeights.LOW * .5)) / (FilterWeights.HIGH + FilterWeights.MEDIUM + FilterWeights.LOW);
  expect(Scanner.calculateConfidence(scores)).toStrictEqual(confidence);
});

test('confidence calculation- negative weights', () => {
  const scores = [
    {
      name: "filter1",
      negativeWeight: FilterWeights.HIGH,
      score: 0,
    }
  ];
  expect(Scanner.calculateConfidence(scores)).toStrictEqual(0);

  scores.push({
    name: "filter2",
    negativeWeight: FilterWeights.MEDIUM,
    score: 0,
  });
  expect(Scanner.calculateConfidence(scores)).toStrictEqual(0);
});

test('confidence calculation- mixed weights', () => {
  const scores = [
    {
      name: "filter1",
      weight: FilterWeights.HIGH,
      score: .9,
    },
    {
      name: "filter2",
      negativeWeight: FilterWeights.MEDIUM,
      score: 0,
    },
    {
      name: "filter3",
      weight: FilterWeights.LOW,
      score: .5,
    },
  ];

  const confidence = ((FilterWeights.HIGH * .9) + (FilterWeights.MEDIUM * 0) + (FilterWeights.LOW * .5)) / (FilterWeights.HIGH + FilterWeights.MEDIUM + FilterWeights.LOW);
  expect(Scanner.calculateConfidence(scores)).toStrictEqual(confidence);
});
