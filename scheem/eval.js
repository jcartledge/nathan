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
    case '*': return binary_op(expr, env, function(a, b) { return a * b; });
    case '/': return binary_op(expr, env, function(a, b) { return a / b; });
    case '+': return binary_op(expr, env, function(a, b) { return a + b; });
    case '-': return binary_op(expr, env, function(a, b) { return a - b; });
    case '-':
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

var binary_op = function(expr, env, op) {
  var left = _eval(expr[1], env);
  var right =  _eval(expr[2], left.env);
  return {
    'result':  op(left.result, right.result),
    'env': right.env
  };
};

module.exports = evalScheem;
