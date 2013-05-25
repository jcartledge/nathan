var scheem = require("./eval.js");

var env = {a: 2, b: 7};
var result = scheem(['define', 'x', 5], env);
console.log(result);
