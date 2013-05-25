var PEG = require('pegjs');
var fs = require('fs');

// Create my parser
module.exports = PEG.buildParser(fs.readFileSync('mus.peg', 'utf-8')).parse;

/**
 * Notes are `[note][octave]:[duration (ms)]`.
 * Rests are `_:[duration (ms)]`.
 * Notes are separated by optional whitespace or commas.
 * Chords are joined with ampersands (&).
 * Whitespace and commas are not required, but can be used anywhere between 
 * notes and rests to enhance readability.
 */
