var scheem = require("./eval.js");

var env = {a: 2, b: 7};
var result = scheem(['set!', 'a', 3], env);
console.log(result);
