var evalScheem = require("./eval.js");
var parse = require("./parse.js");

evalScheem(parse("(alert 'hello 'world)"), {'bindings': {}});
