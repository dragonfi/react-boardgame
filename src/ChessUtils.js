
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

class Position {
  constructor(fromString) {
    this.file = this._fileFromString(fromString);
    this.rank = this._rankFromString(fromString);
  }
  copy() {
    var p = new Position('');
    p.file = this.file;
    p.rank = this.rank;
    return p;
  }
  _fileFromString(fromString) {
    return fromString[0];
  }
  _rankFromString(fromString) {
    return Number(fromString[1]);
  }
  offsetRank(deltaRank) {
    return this.copy().setRank(this.rank + deltaRank);
  }
  offsetFile(deltaFile) {
    const newFile = String.fromCharCode(this.file.charCodeAt(0) + deltaFile);
    return this.copy().setFile(newFile);
  }
  setFile(newFile) {
    var p = this.copy();
    p.file = newFile;
    return p;
  }
  setRank(newRank) {
    var p = this.copy();
    p.rank = newRank;
    return p;
  }
  toString() {
    return this.file.toString() + this.rank;
  }
}

export {files, ranks, Position};
