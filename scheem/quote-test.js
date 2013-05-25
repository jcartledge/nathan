var scheem = require("./eval.js");

var env = {'x': 0};
var prg = ['set!', 'x', ['quote', [1, '#t']]];
var result = scheem(prg, env);
console.log(result);
