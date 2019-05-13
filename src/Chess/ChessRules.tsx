import {Position} from '../BoardGameUtils/Position';
import {BoardState, PieceState, BoardGameRules} from '../BoardGame/BoardGame';
import {ObjectMap}from '../Utils/ObjectMap';

import '../BoardGame/CheckeredBoard.css';

const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
const NOCOLOR = "";

const PAWN = "pawn";
const ROOK = "rook";
const KNIGHT = "knight";
const BISHOP = "bishop";
const QUEEN = "queen";
const KING = "king";


interface ChessBoardState extends BoardState {
  promotablePawn: string | null;
  availableEnPassant: {
    captureMove: string;
    captureablePiece: string;
  } | null;
  canLongCastle: ObjectMap<boolean>;
  canShortCastle: ObjectMap<boolean>;
}

function opposingColor(color: string): string {
  switch (color) {
    case WHITE: return BLACK;
    case BLACK: return WHITE;
    default: return NOCOLOR;
  }
}

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

function projectedMove(board: BoardState, square: string, direction: Array<number>, color: string): Array<string> {
  let moves = [];
  for(const i of [1, 2, 3, 4, 5, 6, 7]) {
    const dfile = direction[0] * i;
    const drank = direction[1] * i;
    const newSquare = new Position(square).offsetFile(dfile).offsetRank(drank).toString();
    if (hasFriendlyPiece(board, newSquare, color)) {
      break;
    }
    moves.push(newSquare);
    if (hasOpposingPiece(board, newSquare, color)) {
      break;
    }
  }
  return moves;
}

class PawnPromotionSelector {
  static condition(board: ChessBoardState): boolean {
    return !!board.promotablePawn;
  }
  static options(board: ChessBoardState): Array<PieceState> {
    const color = board.promotablePawn ? board.pieces[board.promotablePawn].color: null;
    return color ? [
      {pieceType: QUEEN, color: color},
      {pieceType: ROOK, color: color},
      {pieceType: KNIGHT, color: color},
      {pieceType: BISHOP, color: color},
    ] : [];
  }
  static handleResult(board: ChessBoardState, result: PieceState): ChessBoardState {
    const pieces = board.promotablePawn ? {...board.pieces, [board.promotablePawn]: result}: {...board.pieces};
    return {...board, pieces: pieces, promotablePawn: null};
  }
}

class PawnRules {
  static figure = "♟";

  static validMoves(board: ChessBoardState, square: string): Array<string> {
    const piece = board.pieces[square];
    const side = piece.color;

    const direction = side === WHITE ? 1 : -1;
    const validMoves = [];

    const newSquare = new Position(square).offsetRank(direction).toString();
    if (isEmptySquare(board, newSquare)) {
      validMoves.push(newSquare);

      if ([2, 7].includes(new Position(square).rank)) {
        const newSquare = new Position(square).offsetRank(direction*2).toString();
        if (isEmptySquare(board, newSquare)) {
          validMoves.push(newSquare);
        }
      }
    }

    for (const drank of [-1, 1]) {
      const newSquare = new Position(square).offsetFile(drank).offsetRank(direction).toString();
      if (hasOpposingPiece(board, newSquare, piece.color)) {
        validMoves.push(newSquare);
      }

      if (this._isValidEnPassant(board, newSquare, side)) {
        validMoves.push(newSquare);
      }
    }
    return validMoves;
  }

  static movePiece(board: ChessBoardState, square: string, newSquare: string): ChessBoardState {
    const pieces = {...board.pieces};
    const piece = board.pieces[square];
    const direction = piece.color === WHITE ? 1 : -1;
    const _square = new Position(square);
    const  _newSquare = new Position(newSquare);

    const isDoubleMove = ([2, 7].includes(_square.rank) && [4, 5].includes(_newSquare.rank));
    const availableEnPassant = isDoubleMove ? {
      captureMove: _square.offsetRank(direction).toString(),
      captureablePiece: _newSquare.toString(),
    } : null;

    pieces[newSquare] = piece;
    delete pieces[square];

    if (board.availableEnPassant && board.availableEnPassant.captureMove === newSquare) {
      delete pieces[board.availableEnPassant.captureablePiece];
    }

    const promotablePawn = [1, 8].includes(_newSquare.rank) ? newSquare : null;

    return {
      ...board,
      availableEnPassant: availableEnPassant,
      promotablePawn: promotablePawn,
      pieces: pieces};
  }

  static _isLastRow(square: Position, color: string): boolean {
    return (color === WHITE && square.rank === 8) || (color === BLACK && square.rank === 1);
  }

  static _isValidEnPassant(board: ChessBoardState, square: string, color: string): boolean {
    return !!(
      board.availableEnPassant &&
      square === board.availableEnPassant.captureMove &&
      hasOpposingPiece(board, board.availableEnPassant.captureablePiece, color)
    );
  }
}

class KingRules {
  static figure = "♚";
  static validMoves(board: ChessBoardState, square: string): Array<string> {
    const piece = board.pieces[square];

    const validMoves = [];
    for (const [dFile, dRank] of [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [0, -1], [-1, -1]]) {
      const newSquare = new Position(square).offsetFile(dFile).offsetRank(dRank).toString();
      if (!hasFriendlyPiece(board, newSquare, piece.color)) {
        validMoves.push(newSquare);
      }
    }

    const _square = new Position(square);
    if (board.canLongCastle[piece.color]) {
      const emptySquares = [-1, -2, -3].map(
        (offset) => _square.offsetFile(offset).toString()
      );

      if (emptySquares.every((square) => isEmptySquare(board, square))) {
        validMoves.push(emptySquares[1]);
      }
    }

    if (board.canShortCastle[piece.color]) {
      const emptySquares = [1, 2].map(
        (offset) => _square.offsetFile(offset).toString()
      );

      if (emptySquares.every((square) => isEmptySquare(board, square))) {
        validMoves.push(emptySquares[1]);
      }
    }

    return validMoves;
  }

  static movePiece(board: ChessBoardState, square: string, newSquare: string): ChessBoardState {
    const pieces = {...board.pieces};
    const piece = board.pieces[square];
    const dest = new Position(newSquare);

    if (board.canLongCastle[piece.color] && dest.file === 'c') {
      const rookSource = dest.setFile('a');
      const rookDest = dest.setFile('d');
      pieces[rookDest.toString()] = pieces[rookSource.toString()];
      delete pieces[rookSource.toString()];
    }

    if (board.canShortCastle[piece.color] && dest.file === 'g') {
      const rookSource = dest.setFile('h');
      const rookDest = dest.setFile('f');
      pieces[rookDest.toString()] = pieces[rookSource.toString()];
      delete pieces[rookSource.toString()];
    }

    pieces[newSquare] = piece;
    delete pieces[square];

    board.canShortCastle[piece.color] = false;
    board.canLongCastle[piece.color] = false;

    return {
      ...board,
      pieces: pieces,
    };
  }
}

class KnightRules {
  static figure = "♞";

  static validMoves(board: ChessBoardState, square: string): Array<string> {
    const piece = board.pieces[square];
    let validMoves = [];
    for (const [dRank, dFile] of [[-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1], [-2, -1], [-2, 1]]) {
      let newSquare = new Position(square).offsetFile(dFile).offsetRank(dRank).toString();
      if (!hasFriendlyPiece(board, newSquare, piece.color)) {
        validMoves.push(newSquare);
      }
    }
    return validMoves;
  }

  static movePiece(board: ChessBoardState, square: string, newSquare: string): ChessBoardState {
    const pieces = {...board.pieces};
    const piece = board.pieces[square];

    pieces[newSquare] = piece;
    delete pieces[square];

    return {
      ...board,
      pieces: pieces,
    };
  }
}

class ProjectingPieceMoves {
  static directions: Array<Array<number>> = [];
  static validMoves(board: ChessBoardState, square: string): Array<string> {
    const piece = board.pieces[square];
    let validMoves: Array<string> = [];
    for (const direction of this.directions) {
      validMoves = validMoves.concat(projectedMove(board, square, direction, piece.color));
    }
    return validMoves;
  }

  static movePiece(board: ChessBoardState, square: string, newSquare: string): ChessBoardState {
    const pieces = {...board.pieces};
    const piece = board.pieces[square];

    pieces[newSquare] = piece;
    delete pieces[square];

    return {...board, pieces: pieces};
  }
}

class RookRules extends ProjectingPieceMoves {
  static figure = "♜";
  static directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  static movePiece(board: ChessBoardState, square: string, newSquare: string): ChessBoardState {
    const newBoard = super.movePiece(board, square, newSquare);
    const piece = board.pieces[square];
    const _square = new Position(square);

    if (_square.file === 'a') {
      newBoard.canLongCastle[piece.color] = false;
    }
    if (_square.file === 'h') {
      newBoard.canShortCastle[piece.color] = false;
    }
    return newBoard;
  }
}

class BishopRules extends ProjectingPieceMoves {
  static figure = "♝";
  static directions = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
}

class QueenRules extends ProjectingPieceMoves {
  static figure = "♛";
  static directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
}

function initialBoardState(): ChessBoardState {
  return {
    pieces: {
      "a2": {pieceType: PAWN, color: WHITE},
      "b2": {pieceType: PAWN, color: WHITE},
      "c2": {pieceType: PAWN, color: WHITE},
      "d2": {pieceType: PAWN, color: WHITE},
      "e2": {pieceType: PAWN, color: WHITE},
      "f2": {pieceType: PAWN, color: WHITE},
      "g2": {pieceType: PAWN, color: WHITE},
      "h2": {pieceType: PAWN, color: WHITE},
      "a7": {pieceType: PAWN, color: BLACK},
      "b7": {pieceType: PAWN, color: BLACK},
      "c7": {pieceType: PAWN, color: BLACK},
      "d7": {pieceType: PAWN, color: BLACK},
      "e7": {pieceType: PAWN, color: BLACK},
      "f7": {pieceType: PAWN, color: BLACK},
      "g7": {pieceType: PAWN, color: BLACK},
      "h7": {pieceType: PAWN, color: BLACK},
      "e1": {pieceType: KING, color: WHITE},
      "e8": {pieceType: KING, color: BLACK},
      "a1": {pieceType: ROOK, color: WHITE},
      "h1": {pieceType: ROOK, color: WHITE},
      "a8": {pieceType: ROOK, color: BLACK},
      "h8": {pieceType: ROOK, color: BLACK},
      "c1": {pieceType: BISHOP, color: WHITE},
      "f1": {pieceType: BISHOP, color: WHITE},
      "c8": {pieceType: BISHOP, color: BLACK},
      "f8": {pieceType: BISHOP, color: BLACK},
      "b1": {pieceType: KNIGHT, color: WHITE},
      "g1": {pieceType: KNIGHT, color: WHITE},
      "b8": {pieceType: KNIGHT, color: BLACK},
      "g8": {pieceType: KNIGHT, color: BLACK},
      "d1": {pieceType: QUEEN, color: WHITE},
      "d8": {pieceType: QUEEN, color: BLACK},
    },
    activeSide: WHITE,
    availableEnPassant: null,
    canLongCastle: {
      [WHITE]: true,
      [BLACK]: true,
    },
    canShortCastle: {
      [WHITE]: true,
      [BLACK]: true,
    },
    promotablePawn: null,
  }
}

const rules: BoardGameRules<ChessBoardState> = {
  board: {ranks: 8, files: 8, style: "checkered"},
  initialBoardState: initialBoardState,
  pieces: {
    [PAWN]: PawnRules,
    [KING]: KingRules,
    [ROOK]: RookRules,
    [BISHOP]: BishopRules,
    [KNIGHT]: KnightRules,
    [QUEEN]: QueenRules,
  },
  emptySquareMove: (board, _) => board,
  selectors: [PawnPromotionSelector],
}

// Piece figures: ♔♕♖♗♘♙♚♛♜♝♞♟

export {rules};
