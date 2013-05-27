var evalScheem = require("./eval.js");
var assert_eq = require("assert").deepEqual;
var env = {'bindings': {}};

assert_eq(evalScheem(
  ['if', ['=', 1, 1], 2, 3], env),
  2,
  '(if (= 1 1) 2 3) test'
);

assert_eq(evalScheem(
  ['if', ['=', 1, 0], 2, 3], env),
  3,
  '(if (= 1 0) 2 3) test'
);

assert_eq(evalScheem(
  ['if', ['=', 1, 1], 2, 'error'], env),
  2,
  '(if (= 1 1) 2 error) test'
);

assert_eq(evalScheem(
  ['if', ['=', 1, 0], 'error', 3], env),
  3,
  '(if (= 1 1) error 3) test'
);

assert_eq(evalScheem(
  ['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12], env),
  11,
  '(if (= 1 1) (if (= 2 3) 10 11) 12) test'
);
