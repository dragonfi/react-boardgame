
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

function rankRange(count: number): Array<number> {
  return Array.from({length: count}, (_, i) => count - i);
}

function fileRange(count: number): Array<string> {
  return Array.from({length: count}, (_, i) => String.fromCharCode("a".charCodeAt(0) + i));
}

class Position {
  file: string;
  rank: number;
  constructor(fromString: string) {
    this.file = this._fileFromString(fromString);
    this.rank = this._rankFromString(fromString);
  }
  copy(): Position {
    const p = new Position(this.toString());
    p.file = this.file;
    p.rank = this.rank;
    return p;
  }
  _fileFromString(fromString: string): string {
    return fromString[0];
  }
  _rankFromString(fromString: string): number {
    return Number(fromString[1]);
  }
  offsetRank(deltaRank: number): Position {
    return this.copy().setRank(this.rank + deltaRank);
  }
  offsetFile(deltaFile: number): Position {
    const newFile = String.fromCharCode(this.file.charCodeAt(0) + deltaFile);
    return this.copy().setFile(newFile);
  }

  setFile(newFile: string): Position {
    var p = this.copy();
    p.file = newFile;
    return p;
  }
  setRank(newRank: number): Position {
    var p = this.copy();
    p.rank = newRank;
    return p;
  }
  toString(): string {
    return this.file.toString() + this.rank;
  }
}

export {files, ranks, rankRange, fileRange, Position};
