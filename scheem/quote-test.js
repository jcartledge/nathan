var evalScheem = require("./eval.js");
var parse = require("./parse.js");
var assert_eq = require("assert").deepEqual;

var env = {'bindings': {}};
assert_eq(evalScheem(parse("'(1 #t)"), env), [1, '#t']);
assert_eq(evalScheem(parse("(quote (1 #t))"), env), [1, '#t']);
