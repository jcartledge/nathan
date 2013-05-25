var endTime = function (time, expr) {
  switch (expr.tag) {
    case 'note':
      return time + expr.dur;
    case 'rest':
      return time + expr.duration;
    case 'seq':
      return time + endTime(0, expr.left) + endTime(0, expr.right);
    case 'par':
      return time + Math.max(endTime(0, expr.left), endTime(0, expr.right));
    case 'repeat':
      return time + (expr.count * endTime(0, expr.section));
  }
};

var convertPitch = function(pitch) {
  return (function(note) {
    return ((note.octave + 5) * 12) + parseInt({
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3,
      'E': 4, 'F': 5, 'F#': 6, 'G': 7,
      'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    }[note.name], 10);
  }((function(note) {
    return {
      name: note[1],
      octave: note[2]
    };
  }(pitch.toUpperCase().match(/([A-Z]\#?)([\d]+)/)))));
};

var compile = function (musexpr, start, acc) {
  if (!start) start = 0;
  if (!acc) acc = [];
  switch (musexpr.tag) {
    case 'seq':
      return compile(
        musexpr.right, endTime(start, musexpr.left), compile(
          musexpr.left, start, acc));
    case 'par':
      return compile(
        musexpr.right, start, compile(
          musexpr.left, start, acc));
    case 'note':
      return acc.concat({
        'tag': musexpr.tag,
        'pitch': convertPitch(musexpr.pitch),
        'dur': musexpr.dur,
        'start': start
      });
    case 'rest':
      return acc.concat({
        'tag': musexpr.tag,
        'dur': musexpr.duration,
        'start': start
      });
    case 'repeat':
      return (function repeat(expr, count, acc) {
        if (count === 0) {
          return acc;
        } else {
          return repeat(expr, count - 1, acc.concat(
            compile(expr, endTime(start, expr), acc)));
        }
      }(musexpr.section, musexpr.count, acc));
  }
};

module.exports = compile;
