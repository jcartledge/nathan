var parse = require("./parse.js");
var scheem = require("./eval.js");
var fs = require('fs');

var src = fs.readFileSync('./test/test-2.scheem', 'utf-8');
var ast = parse(src);
console.log(ast);
console.log(scheem(ast));
