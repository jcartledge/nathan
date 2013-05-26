var evalScheem = require("./eval.js");
var assert_eq = require("assert").deepEqual;

var env1 = { bindings: {'x': 19}, outer: { } };
var env2 = { bindings: {'y': 16}, outer: env1};
var env3 = { bindings: {'x': 2}, outer: env2};
var env3_copy = { bindings: {'x': 2}, outer: env2};

assert_eq(
  evalScheem('x', env3),
  2,
  'Variable reference in environment');

assert_eq(
  evalScheem(['+', 'x', 'y'], env3),
  18,
  'Variable references in environment');

assert_eq(
  evalScheem(['let-one', 'x', ['+', 2, 2], 'x'], env3),
  4,
  'let-one with computed value');

assert_eq(env3, env3_copy, 'environment did not change');

assert_eq(
  evalScheem(['let-one', 'z', 7, 'z'], env3),
  7,
  'let-one with environment, inner reference');

assert_eq(
  evalScheem(['let-one', 'x', 7, 'y'], env3),
  16,
  'let-one with environment, outer reference');
