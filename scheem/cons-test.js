var evalScheem = require("./eval.js");
var assert_eq = require("assert").deepEqual;

// cons
// assert.deepEqual(
//   scheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
//   [[1, 2], 3, 4]
// );

// // car
// assert.deepEqual(
//   scheem(['car', 'quote', [1, 2, 3]], {}),
//   1
// );


// // cdr
// assert.deepEqual(
//   scheem(['cdr', 'quote', [1, 2, 3]], {}),
//   [2, 3]
// );

assert_eq(
  evalScheem(['quote', [2, 3]], {}),
  [2, 3],
  '(quote (2 3)) test');

assert_eq(
  evalScheem(['cons', 1, ['quote', [2, 3]]], {}),
  [1, 2, 3],
  "(cons 1 '(2 3)) test");

assert_eq(
  evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
  [[1, 2], 3, 4],
  "(cons '(1 2) '(3 4)) test");

assert_eq(
  evalScheem(['car', ['quote', [[1, 2], 3, 4]]], {}),
  [1, 2],
  "(car '((1 2) 3 4)) test");

assert_eq(evalScheem(
  ['cdr', ['quote', [[1, 2], 3, 4]]], {}),
  [3, 4],
  "(cdr '((1 2) 3 4)) test");
