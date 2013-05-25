var parse = require('./parse.js');
var compile = require('./compiler.js');

console.log(compile(parse('_:100,a1:100 & d#1:100 & c3:50, _:40')));
