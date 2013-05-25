var scheem = require("./eval.js");

var env = {a: 2, b: 7};
var prg = ['begin',
            ['define', 'x', 5],
            ['set!', 'x', ['+', 'x', 1]],
            ['+', 2, 'x']];
var result = scheem(prg, env);
console.log(result);
