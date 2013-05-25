var evalScheem = function (expr, env) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;
  }
  // Strings which are not keywords are variable references
  if (typeof expr === 'string') {
    return env[expr];
  }
  // Look at head of list for operation
  switch (expr[0]) {
    case '*':
      return evalScheem(expr[1], env) *
             evalScheem(expr[2], env);
    case '/':
      return evalScheem(expr[1], env) /
             evalScheem(expr[2], env);
    case '+':
      return evalScheem(expr[1], env) +
             evalScheem(expr[2], env);
    case '-':
      return evalScheem(expr[1], env) -
             evalScheem(expr[2], env);
    case 'define':
      if (typeof expr[1] !== 'string') {
        return new Error('define: Invalid key: ' + expr[1]);
      }
      if (expr[1] in env) {
        return new Error('define: Key already defined: ' + expr[1]);
      }
      env[expr[1]] = evalScheem(expr[2], env);
      return 0;
    case 'set!':
      if (!(expr[1] in env)) {
        return new Error('set!: Key not defined: ' + expr[1]);
      }
      env[expr[1]] = evalScheem(expr[2], env);
      return 0;
  }
};

module.exports = evalScheem;
