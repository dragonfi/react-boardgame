import {BoardState, BoardGameRules, PieceState} from '../BoardGame/BoardGame';
import {Position} from '../BoardGameUtils/Position';
import {ObjectMap} from '../Utils/ObjectMap';

import '../BoardGame/CheckeredBoard.css';

const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
const NOCOLOR = "";

function opposingColor(color: string): string {
  switch (color) {
    case WHITE: return BLACK;
    case BLACK: return WHITE;
    default: return NOCOLOR;
  }
}

const MAN = "man";
const KING = "king";


function squareColor(board: BoardState, square: string): string {
  const piece = board.pieces[square];
  return piece ? piece.color : NOCOLOR;
}

function hasOpposingPiece(board: BoardState, square: string, color: string): boolean {
  return squareColor(board, square) === opposingColor(color);
}

function hasFriendlyPiece(board: BoardState, square: string, color: string): boolean {
  return squareColor(board, square) === color;
}

function isEmptySquare(board: BoardState, square: string): boolean {
  return squareColor(board, square) === NOCOLOR;
}

interface CheckersBoardState extends BoardState {
}

function initialBoardState(): CheckersBoardState {
  const corner = new Position("`0");
  const blackCorner = new Position("k11");
  let pieces: ObjectMap<PieceState> = {};

  for(let file = 1; file < 10; file+=2) {
    for (let rank = 1; rank < 5; rank+=1) {
      const file2 = rank % 2 == 0 ? 1 : 0;
      const whiteKey = corner.offsetFile(file + file2).offsetRank(rank).toString();
      pieces[whiteKey] = {pieceType: MAN, color: WHITE};
      const blackKey = blackCorner.offsetFile(-file-file2).offsetRank(-rank).toString();
      pieces[blackKey] = {pieceType: MAN, color: BLACK};
    }
  }
  return {
    pieces: pieces,
    activeSide: WHITE,
  }
}

class ManRules {
  static figure = "⛂";
  static validMoves(board: CheckersBoardState, square: string): Array<string> {
    const _square = new Position(square);
    const color = board.pieces[square].color;
    const forward = color === WHITE ? 1 : -1;
    // move directions [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    let validMoves: Array<string> = [];
    for (const direction of [[-1, forward], [1, forward]]) {
      const move = _square.offsetFile(direction[0]).offsetRank(direction[1]).toString();
      if (isEmptySquare(board, move)) {
        validMoves.push(move);
      }
    }
    for (const direction of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
      const move = _square.offsetFile(direction[0]).offsetRank(direction[1]).toString();
      const jump = _square.offsetFile(direction[0]*2).offsetRank(direction[1]*2).toString();
      if (hasOpposingPiece(board, move, color) && isEmptySquare(board, jump)) {
        validMoves.push(jump);
      }
    }

    return (validMoves
      .map((m) => new Position(m))
      .filter((p) => p.rank < 11 && p.rank > 0)
      .filter((p) => p.file > '`' && p.file < 'k')
      .map((p) => p.toString())
    );
  }

  static movePiece(board: CheckersBoardState, square: string, newSquare: string): CheckersBoardState {
    const pieces = {...board.pieces};
    let piece = {...board.pieces[square]};

    for (const jumpedSquare of this._jumpedSquares(square, newSquare)) {
      delete pieces[jumpedSquare];
    }

    pieces[newSquare] = piece;
    delete pieces[square];

    let newBoard = {...board, pieces: pieces};
    const newRank = new Position(newSquare).rank;
    if ((newRank === 10 && piece.color === WHITE) || (newRank === 1 && piece.color === BLACK)) {
      if (this.validMoves(newBoard, newSquare).length === 0) {
        newBoard.pieces[newSquare].pieceType = KING;
      }
    }

    return newBoard;
  }

  static _jumpedSquares(square: string, newSquare: string): Array<string> {
    const _square = new Position(square);
    const _newSquare = new Position(newSquare);
    const direction = [
      _newSquare.file > _square.file ? 1 : -1,
      _newSquare.rank > _square.rank ? 1 : -1,
    ];
    const jumpedSquares = [];
    for (let i = 1; i < 10; i++) {
      const jumpedSquare = _square.offsetFile(direction[0]*i).offsetRank(direction[1]*i);
      if (jumpedSquare.toString() === _newSquare.toString()) {
        break;
      }
      jumpedSquares.push(jumpedSquare.toString());
    }
    return jumpedSquares;
  }
}

class KingRules extends ManRules {
  static figure = "⛃";
  static validMoves(board: CheckersBoardState, square: string): Array<string> {
    const _square = new Position(square);
    const color = board.pieces[square].color;
    // move directions [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    let validMoves: Array<string> = [];
    for (const direction of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
      let alreadyJumped = false;
      for (let i = 1; i < 10; i++) {
        const move = _square.offsetFile(direction[0]*i).offsetRank(direction[1]*i).toString();
        if (hasFriendlyPiece(board, move, color)) {
          break;
        }
        if (hasOpposingPiece(board, move, color)) {
          if (alreadyJumped) {
            break;
          }
          alreadyJumped = true;
          continue;
        }
        if (isEmptySquare(board, move)) {
          validMoves.push(move);
        }
      }
    }

    return validMoves;
  }
}

let rules: BoardGameRules<CheckersBoardState> = {
  board: {ranks: 10, files: 10, style: "checkered"},
  initialBoardState: initialBoardState,
  pieces: {
    [MAN]: ManRules,
    [KING]: KingRules,
  },
  emptySquareMove: (board, _) => board,
  selectors: [],
};

// Unicode figures: ⛀⛁⛂⛃

export {rules};
