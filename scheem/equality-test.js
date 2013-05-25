var scheem = require("./eval.js");

var env = {'x': 1};
var prg = ['begin',
  ['define', 'a', ['=', 1, 'x']],
  ['>', 'x', ['+', 3, 5]]
];

var result = scheem(prg, env);
console.log(result);
