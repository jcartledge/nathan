var scheem = require("./eval.js");
var assert = require("assert");

// cons
assert.deepEqual(
  scheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
  [[1, 2], 3, 4]
);

// car
assert.deepEqual(
  scheem(['car', 'quote', [1, 2, 3]], {}),
  1
);


// cdr
assert.deepEqual(
  scheem(['cdr', 'quote', [1, 2, 3]], {}),
  [2, 3]
);
