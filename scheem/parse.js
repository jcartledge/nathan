var PEG = require('pegjs');
var fs = require('fs');

module.exports = PEG.buildParser(fs.readFileSync('scheem.peg', 'utf-8')).parse;
