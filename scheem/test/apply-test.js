var evalScheem = require("../eval.js");
var assert_eq = require("assert").deepEqual;

var always3 = function (x) { return 3; };
var identity = function (x) { return x; };
var plusone = function (x) { return x + 1; };
var env = {
  'bindings': {
    'always3': always3,
    'identity': identity,
    'plusone': plusone
  },
  'outer': {}
};


assert_eq(
  evalScheem(['always3', 5], env),
  3,
  '(always3 5)'
);

assert_eq(
  evalScheem(['identity', 5], env),
  5,
  '(identity 5)'
);

assert_eq(
  evalScheem(['plusone', 5], env),
  6,
  '(plusone 5)'
);

assert_eq(
  evalScheem(['plusone', ['always3', 5]], env),
  4,
  '(plusone (always3 5))'
);

assert_eq(
  evalScheem(['plusone', ['+', ['plusone', 2], ['plusone', 3]]], env),
  8,
  '(plusone (+ (plusone 2) (plusone 3)))'
);
