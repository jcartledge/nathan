var evalScheem = function (expr, env) {
  var result = _eval(expr, env);
  console.log(result.env);
  return result.result;
};

var _eval = function(expr, env) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return { 'result':expr, 'env':env };
  }
  // Strings which are not keywords are variable references
  if (typeof expr === 'string') {
    return { 'result': env[expr], 'env': env };
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
    case 'define':
      if (typeof expr[1] !== 'string') {
        throw new Error('define: Invalid key: ' + expr[1]);
      }
      if (expr[1] in env) {
        throw new Error('define: Key already defined: ' + expr[1]);
      }
      env[expr[1]] = _eval(expr[2], env).result;
      return { 'result': 0, 'env': env };
    case 'set!':
      if (!(expr[1] in env)) {
        throw new Error('set!: Key not defined: ' + expr[1]);
      }
      env[expr[1]] = _eval(expr[2], env).result;
      return { 'result': 0, 'env': env };

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


    case 'quote':
      return {'result': expr[1], env: env };
  }
};

var numbinop = function(expr, env, op) {
  console.log(expr);
  var left = _eval(expr[1], env);
  console.log(left);
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

module.exports = evalScheem;
