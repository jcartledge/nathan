var evalScheem = require("./eval.js");
var assert_eq = require("assert").deepEqual;

assert_eq(evalScheem([['lambda-one', 'x', 'x'], 5], { }), 5,
    '((lambda-one x x) 5)');
assert_eq(evalScheem([['lambda-one', 'x',
    ['+', 'x', 1]], 5], { }), 6,
    '((lambda-one x (+ x 1)) 5)');
assert_eq(evalScheem([[['lambda-one', 'x',
    ['lambda-one', 'y', ['+', 'x', 'y']]], 5], 3], { }), 8,
    '(((lambda-one x (lambda-one y (+ x y))) 5) 3)');
assert_eq(evalScheem([[['lambda-one', 'x',
    ['lambda-one', 'x', ['+', 'x', 'x']]], 5], 3], { }), 6,
    '(((lambda-one x (lambda-one x (+ x x))) 5) 3)');
