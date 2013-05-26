var evalScheem = function (expr, env) {
  var result = _eval(expr, env);
  return result.result;
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
     * Numeric operators
     */
    case '*':
      return numbinop(expr, env, function(a, b) {
        return a * b;
      });
    case '/':
      return numbinop(expr, env, function(a, b) {
        return a / b;
      });
    case '+':
      return numbinop(expr, env, function(a, b) {
        return a + b;
      });
    case '-':
      return numbinop(expr, env, function(a, b) {
        return a - b;
      });
    case '=':
      return numbinop(expr, env, function(a, b) {
        return a === b ? '#t':'#f';
      });
    case '>':
      return numbinop(expr, env, function(a, b) {
        return a > b ? '#t':'#f';
      });
    case '<':
      return numbinop(expr, env, function(a, b) {
        return a < b ? '#t':'#f';
      });

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
      var scope = define(expr.slice(1, 3), {
        outer: env,
        bindings: {}
      });
      return _eval(expr[3], scope);

    /**
     * Data operations:
     * cons, car, cdr, quote
     */
    case 'cons':
      head = _eval(expr[1], env);
      tail = _eval(expr[2], head.env);
      return {
        'result': [head.result].concat(tail.result),
        'env': tail.env
      };
    case 'car':
      tail = _eval(expr[1], env);
      return {
        'result': tail.result[0],
        'env': tail.env
      };
    case 'cdr':
      tail = _eval(expr[1], env);
      return {
        'result': tail.result.slice(1),
        'env': tail.env
      };
    case 'quote':
      return {'result': expr[1], env: env };

    /**
     * Functions
     */
    case 'lambda-one':
      var param = expr[1];
      var body = expr[2];
      var lambda = function(arg) {
        var scope = define([param, arg], {
          outer: env,
          bindings: {}
        });
        return _eval(body, scope).result;
      };
      return {'result': lambda, 'env': env};

    default:
      var fn = evalScheem(expr[0], env);
      var args = expr.slice(1).map(function(arg) {
        return evalScheem(arg, env);
      });
      return {'result': fn.apply(this, args), 'env': env};
  }
};

var numbinop = function(expr, env, op) {
  var left = _eval(expr[1], env);
  var right = _eval(expr[2], left.env);
  require_num(op, left.result, right.result);
  return {
    'result':  op(left.result, right.result),
    'env': right.env
  };
};

var require_num = function(op) {
  [].slice.call(arguments, 1).map(function(arg) {
    if (typeof arg !== 'number') {
      throw new Error(op + ': Number required, value supplied was: ' + arg);
    }
  });
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

module.exports = evalScheem;
