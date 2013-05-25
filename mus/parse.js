var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');

// Create my parser
var parse = PEG.buildParser(fs.readFileSync('mus.peg', 'utf-8')).parse;

// Do a test
assert.deepEqual(
  parse('_:100,a1:100 & d#1:100 & c3:50, _:40'),
  {
     "tag": "seq",
     "left": {
        "tag": "rest",
        "duration": 100
     },
     "right": {
        "tag": "par",
        "left": {
           "tag": "note",
           "pitch": "A1",
           "dur": 100
        },
        "right": {
         "tag": "par",
         "left": {
          "tag": "note",
          "pitch": "D#1",
          "dur": 100
        },
        "right": {
          "tag": "seq",
          "left": {
           "tag": "note",
           "pitch": "C3",
           "dur": 50
         },
         "right": {
           "tag": "rest",
           "duration": 40
         }
       }
     }
   }
}

);
