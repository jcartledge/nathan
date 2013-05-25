
var endTime = function (time, expr) {
    if (expr.tag == 'note') {
        return time + expr.dur;
    } else if (expr.tag == 'rest') {
        return time + expr.duration;
    } else if (expr.tag == 'seq') {
        return time + endTime(0, expr.left) + endTime(0, expr.right);
    } else if (expr.tag == 'par') {
        return time + Math.max(endTime(0, expr.left), endTime(0, expr.right));
    }
};

var convertPitch = function(pitch) {
    return (function(note) {
        return ((note.octave + 5) * 12) + parseInt({
            'C': 0,
            'C#': 1,
            'D': 2,
            'D#': 3,
            'E': 4,
            'F': 5,
            'F#': 6,
            'G': 7,
            'G#': 8,
            'A': 9,
            'A#': 10,
            'B': 11
        }[note.name], 10);
    }((function(note) {
        return {
            name: note[1],
            octave: note[2]
        };
    }(pitch.toUpperCase().match(/([A-Z])([\d]+)/)))));
};

var compile = function (musexpr, start, acc) {
    if (!start) start = 0;
    if (!acc) acc = [];
    if (musexpr.tag == 'seq') {
        return compile(
          musexpr.right, endTime(start, musexpr.left), compile(
            musexpr.left, start, acc));
    } else if (musexpr.tag == 'par') {
        return compile(
          musexpr.right, start, compile(
            musexpr.left, start, acc));
    } else if (musexpr.tag == 'note') {
        return acc.concat({
            'tag': musexpr.tag,
            'pitch': convertPitch(musexpr.pitch),
            'dur': musexpr.dur,
            'start': start
        });
    } else if (musexpr.tag == 'rest') {
        return acc.concat({
            'tag': musexpr.tag,
            'dur': musexpr.duration,
            'start': start
        });
    }
};

var melody_mus =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
