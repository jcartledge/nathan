var evalScheem = require("../eval.js");

var env = {'bindings': {'a': 2, 'b': 7}};
var prg = ['begin',
  ['define', 'x', 5],
  ['set!', 'x', ['+', 'x', 1]],
  ['+', 2, 'x']
];

console.log(evalScheem(prg, env));
