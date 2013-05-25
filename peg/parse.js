var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');

// Create my parser
var parse = PEG.buildParser(data).parse;

// Do a test
assert.deepEqual(
  parse(fs.readFileSync('test/test-1.scheem', 'utf-8')),
  [
    [
      "quote",
      "a"
    ],
    [
      "quote",
      [
        "1",
        "2",
        "3"
      ]
    ]
  ]
);
