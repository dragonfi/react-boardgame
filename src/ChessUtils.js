
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

function squareAdd(square, dfile, drank) {
  var file = files.indexOf(square[0]);
  var rank = Number(square[1]);
  file += dfile;
  rank += drank;
  return '' + files[file] + rank;
}

export {files, ranks, squareAdd};