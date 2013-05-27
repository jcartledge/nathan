var evalScheem = require("./eval.js");
var assert_eq = require("assert").deepEqual;

var env = {'bindings': {'x': 1}};
var prg = ['begin',
  ['define', 'a', ['=', 1, 'x']],
  ['>', 'x', ['+', 3, 5]]
];

assert_eq(evalScheem(['=', 1, 'x'], env), '#t');
assert_eq(evalScheem(['>', 'x', ['+', 3, 5]], env), '#f');
assert_eq(evalScheem(['<', 'x', ['+', 3, 5]], env), '#t');
