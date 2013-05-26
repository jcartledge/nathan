var evalScheem = require("./eval.js");
var parse = require("./parse.js");
var assert_eq = require("assert").deepEqual;

function scheem(src) {
  return evalScheem(parse(src), {});
}
assert_eq(
  scheem('((lambda (x) x) 5)'),
  5
);

assert_eq(
  scheem('((lambda (x) (+ x 1)) 5)'),
  6
);

assert_eq(
  scheem('(((lambda (x) (lambda-one y (+ x y))) 5) 3)'),
  8
);

assert_eq(
  scheem('(((lambda (x) (lambda (x) (+ x x))) 5) 3)'),
  6
);

assert_eq(
  scheem('((lambda (x y) (+ x y)) 5 6)'),
  11
);


assert_eq(
  scheem('((lambda (x y) (* x y)) 5 6)'),
  30
);
