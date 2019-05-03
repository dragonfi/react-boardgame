import {Position} from './ChessUtils.js'

const WHITE = "react-chess-color-white";
const BLACK = "react-chess-color-black";
const WHITE_PROMOTE = "react-chess-color-white-promote";
const BLACK_PROMOTE = "react-chess-color-black-promote";
const NOCOLOR = "";

const PAWN = Symbol("pawn");
const ROOK = Symbol("rook");
const KNIGHT = Symbol("knight");
const BISHOP = Symbol("bishop");
const QUEEN = Symbol("queen");
const KING = Symbol("king");

function opposingColor(color) {
  switch (color) {
    case WHITE: return BLACK;
    case BLACK: return WHITE;
    default: return NOCOLOR;
  }
}

function squareColor(board, square) {
  const piece = board.pieces[square];
  return piece ? piece.color : NOCOLOR;
}

function hasOpposingPiece(board, square, color) {
  return squareColor(board, square) === opposingColor(color);
}

function hasFriendlyPiece(board, square, color) {
  return squareColor(board, square) === color;
}

function isEmptySquare(board, square) {
  return squareColor(board, square) === NOCOLOR;
}

function turnOrder(board) {
  switch (board.activeSide) {
    case WHITE:
      return board.promotablePawn ? WHITE_PROMOTE : BLACK;
      break;
    case BLACK:
      return board.promotablePawn ? BLACK_PROMOTE : WHITE;
      break;
    default:
      return WHITE;
  }
}

class PawnPromotionSelector {
  static condition(board) {
    return !!board.promotablePawn;
  }
  static options(board) {
    const color = board.pieces[board.promotablePawn].color;
    return [
      {pieceType: KING, color: color},
    ];
  }
  static handleResult(board, result) {
    const pieces = {...board.pieces, [board.promotablePawn]: result};
    return {...board, pieces: pieces, promotablePawn: null};
  }
}

class PawnRules {
  static figure = "♟";

  static validMoves(board, square) {
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

  static movePiece(board, square, newSquare) {
    const pieces = {...board.pieces};
    const piece = board.pieces[square];
    const direction = piece.color === WHITE ? 1 : -1;
    const _square = new Position(square);
    const  _newSquare = new Position(newSquare);

    const isDoubleMove = ([2, 7].includes(_square.rank) && [4, 5].includes(_newSquare.rank));
    const availableEnPassant = {
      captureMove: isDoubleMove ? _square.offsetRank(direction).toString() : null,
      captureablePiece: isDoubleMove ? _newSquare.toString(): null,
    }

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

  static _isLastRow(square, color) {
    return (color === WHITE && square.rank === 8 || color === BLACK && square.rank === 1);
  }

  static _isValidEnPassant(board, square, color) {
    return (
      board.availableEnPassant &&
      square === board.availableEnPassant.captureMove &&
      hasOpposingPiece(board, board.availableEnPassant.captureablePiece, color)
    );
  }
}

class KingRules {
  static figure = "♚";
  static validMoves(board, square) {
    const piece = board.pieces[square];

    const validMoves = [];
    for (const [dFile, dRank] of [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [0, -1], [-1, -1]]) {
      const newSquare = new Position(square).offsetFile(dFile).offsetRank(dRank).toString();
      if (!hasFriendlyPiece(board, newSquare, piece.color)) {
        validMoves.push(newSquare);
      }
    }

    const _square = new Position(square);
    console.log(board.canLongCastle);
    if (board.canLongCastle[piece.color]) {
      console.log("long castling");
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

  static movePiece(board, square, newSquare) {
    const pieces = {...board.pieces};
    const piece = board.pieces[square];
    const _square = new Position(square);

    board.canShortCastle[piece.color] = false;
    board.canLongCastle[piece.color] = false;

    const dest = new Position(newSquare);

    if (board.canLongCastle[piece.color] && dest.file === 'c') {
      const rookSource = dest.setFile('a');
      const rookDest = dest.setFile('d');
      pieces[rookDest] = pieces[rookSource];
      delete pieces[rookSource];
    }

    if (board.canShortCastle[piece.color] && dest.file === 'g') {
      const rookSource = dest.setFile('h');
      const rookDest = dest.setFile('f');
      pieces[rookDest] = pieces[rookSource];
      delete pieces[rookSource];
    }

    pieces[newSquare] = piece;
    delete pieces[square];

    return {
      ...board,
      pieces: pieces,
    };
  }
}

function initialBoardState() {
  return {
    pieces: {
      "a2": {pieceType: PAWN, color: WHITE},
      "b2": {pieceType: PAWN, color: WHITE},
      "c2": {pieceType: PAWN, color: WHITE},
      "b4": {pieceType: PAWN, color: BLACK},
      "a7": {pieceType: PAWN, color: BLACK},
      "b7": {pieceType: PAWN, color: BLACK},
      "c7": {pieceType: PAWN, color: BLACK},
      "b5": {pieceType: PAWN, color: WHITE},
      "e1": {pieceType: KING, color: WHITE},
      "e8": {pieceType: KING, color: BLACK},
    },
    activeSide: WHITE,
    availableEnPassant: {
      captureMove: null,
      captureablePiece: null,
    },
    canLongCastle: {
      [WHITE]: true,
      [BLACK]: true,
    },
    canShortCastle: {
      [WHITE]: true,
      [BLACK]: true,
    },
  }
}

const rules = {
  board: {type: "chess", ranks: 8, files: 8},
  sides: [WHITE, BLACK],
  turnOrder: turnOrder,
  initialBoardState: initialBoardState,
  pieces: {
    [PAWN]: PawnRules,
    [KING]: KingRules,
  },
  selectors: [PawnPromotionSelector],
}

const misc = {
'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
}

export {rules};
