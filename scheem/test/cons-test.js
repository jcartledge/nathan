var evalScheem = require("../eval.js");
var assert_eq = require("assert").deepEqual;

var env = {'bindings': {}};

assert_eq(
  evalScheem(['quote', [2, 3]], env),
  [2, 3],
  '(quote (2 3)) test');

assert_eq(
  evalScheem(['cons', 1, ['quote', [2, 3]]], env),
  [1, 2, 3],
  "(cons 1 '(2 3)) test");

assert_eq(
  evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], env),
  [[1, 2], 3, 4],
  "(cons '(1 2) '(3 4)) test");

assert_eq(
  evalScheem(['car', ['quote', [[1, 2], 3, 4]]], env),
  [1, 2],
  "(car '((1 2) 3 4)) test");

assert_eq(evalScheem(
  ['cdr', ['quote', [[1, 2], 3, 4]]], env),
  [3, 4],
  "(cdr '((1 2) 3 4)) test");
