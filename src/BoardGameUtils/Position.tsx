
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

function rankRange(count: number): Array<number> {
  return Array.from({length: count}, (_, i) => count - i);
}

function fileRange(count: number): Array<string> {
  return Array.from({length: count}, (_, i) => String.fromCharCode("a".charCodeAt(0) + i));
}

interface PositionInterface {
  readonly file: string;
  readonly rank: number;
}

class Position implements PositionInterface {
  readonly file: string;
  readonly rank: number;
  constructor(from: string | PositionInterface) {
    if (typeof(from) === 'string') {
      this.file = this._fileFromString(from);
      this.rank = this._rankFromString(from);
    } else {
      this.file = from.file;
      this.rank = from.rank;
    }
  }
  copy(): Position {
    return new Position(this);
  }
  private _fileFromString(fromString: string): string {
    return fromString[0];
  }
  private _rankFromString(fromString: string): number {
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
    return new Position({rank: this.rank, file: newFile});
  }
  setRank(newRank: number): Position {
    return new Position({rank: newRank, file: this.file});
  }
  toString(): string {
    return this.file.toString() + this.rank;
  }
}

export {files, ranks, rankRange, fileRange, Position};
