var assert_eq = require("assert").deepEqual;

var update = function (env, v, val) {
    if('bindings' in env) {
        if(v in env.bindings) {
            env.bindings[v] = val;
            return env;
        }
    }
    if('outer' in env) {
        return {bindings: env.bindings, outer: update(env.outer, v, val)};
    }
};

var env1 = { bindings: {'x': 19}, outer: { } };
var env1u = { bindings: {'x': 20}, outer: { } };
var env2 = {
  bindings: {'y': 16},
  outer: {
    bindings: {'x': 19},
    outer: {}
  }
};

var env2u = { bindings: {'y': 10}, outer:
    { bindings: {'x': 19}, outer: { } }};
var env2v = { bindings: {'y': 10}, outer:
    { bindings: {'x': 20}, outer: { } }};
var env3 = { bindings: {'x': 2}, outer:
    { bindings: {'y': 16}, outer:
        { bindings: {'x': 19}, outer: { } }}};
var env3u = { bindings: {'x': 9}, outer:
    { bindings: {'y': 16}, outer:
        { bindings: {'x': 19}, outer: { } }}};

update(env1, 'x', 20);
assert_eq(env1, env1u, 'Single binding');

update(env2, 'y', 10);
assert_eq(env2, env2u, 'Double binding inner');

console.log(update(env2, 'x', 20));
assert_eq(env2, env2v, 'Double binding outer');

update(env3, 'x', 9);
assert_eq(env3, env3u, 'Triple binding inner');
