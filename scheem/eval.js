var evalScheem = function (expr, env) {

  env = env || {'bindings': {}};
  env.outer = { 'outer': {}, 'bindings': {
    'cons': function(x, xs) { return [x].concat(xs); },
    'car': function(x) { return x[0]; },
    'cdr': function(x) { return x.slice(1); },
    '+': function(x, y) { return  x + y; },
    '-': function(x, y) { return  x - y; },
    '*': function(x, y) { return  x * y; },
    '/': function(x, y) { return  x / y; },
    '=': function(x, y) { return x === y ? '#t': '#f'; },
    '>': function(x, y) { return x > y ? '#t': '#f'; },
    '<': function(x, y) { return x < y ? '#t': '#f'; }
  }};
  return _eval(expr, env).result;
};

var _eval = function(expr, env) {
  var head, tail;

  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return { 'result':expr, 'env':env };
  }
  // Strings which are not keywords are variable references
  if (typeof expr === 'string') {
    return { 'result': lookup(env, expr), 'env': env };
  }
  // Look at head of list for operation
  switch (expr[0]) {

    /**
     * Var setters
     */
    case 'define':  return {'result': 0, 'env': define(expr.slice(1), env)};
    case 'set!':    return {'result': 0, 'env': set(expr.slice(1), env)};

    /**
     * Flow control
     */
    case 'begin':
      return (function loop(exprs, env, acc) {
        if(exprs.length === 0) {
          return { 'result': acc, 'env': env };
        } else {
          var head = _eval(exprs[0], env, acc);
          return loop(exprs.slice(1), head.env, head.result);
        }
      }(expr.slice(1), env));

    case 'if':
      var predicate = _eval(expr[1], env);
      return _eval(
        {'#t': expr[2], '#f': expr[3]}[predicate.result],
        predicate.env
      );

    case 'let-one':
      return let_one({'name': expr[1], 'val':expr[2]}, expr[3], env);

    /**
     * Data operations:
     * cons, car, cdr, quote
     */
    case 'quote':
      return {'result': expr[1], env: env };

    /**
     * Functions
     */
    case 'lambda':
      var params = expr[1];
      var lambda_body = expr[2];
      var lambda = function() {
        var args = arguments;
        return _eval(lambda_body, inner_scope(params.map(function(param, i) {
          return {'name': param, 'val': args[i]};
        }), env)).result;
      };
      return {'result': lambda, 'env': env};

    default:
      var fn = _eval(expr[0], env).result;
      var args = expr.slice(1).map(function(arg) {
        return _eval(arg, env).result;
      });
      return {'result': fn.apply(this, args), 'env': env};
  }
};

var define = function(expr, env) {
  if (typeof expr[0] !== 'string') {
    throw new Error('define: Invalid key: ' + expr[0]);
  }
  if (exists(env, expr[0])) {
    throw new Error('define: Key already defined: ' + expr[0]);
  }
  env.bindings[expr[0]] = _eval(expr[1], env).result;
  return env;
};

var set = function(expr, env) {
  if (!(exists(env, expr[0]))) {
    throw new Error('set!: Key not defined: ' + expr[0]);
  }
  var updated = _eval(expr[1], env);
  return update(updated.env, expr[0], updated.result);
};

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

var lookup = function(env, v) {
  if (!('bindings' in env)) {
    throw new Error('Not found in env: ' + v);
  } else if (v in env.bindings) {
    return env.bindings[v];
  }
  return lookup(env.outer, v);
};

var exists = function(env, v) {
  if('bindings' in env) {
    if (v in env.bindings) return true;
  } else if ('outer' in env) return exists(env.outer, v);
  return false;
};

var let_one = function(scope_var, body, env) {
  return _eval(body, inner_scope([scope_var], env));
};

var inner_scope = function(scope_vars, env) {
  return scope_vars.reduce(function(acc, v) {
    return define([v.name, v.val], acc);
  }, {'bindings': {}, 'outer': env});
};

module.exports = evalScheem;
