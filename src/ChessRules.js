import {Position} from './ChessUtils.js'

const WHITE = "react-chess-color-white";
const BLACK = "react-chess-color-black";
const WHITE_PROMOTE = "react-chess-color-white-promote";
const BLACK_PROMOTE = "react-chess-color-black-promote";

const PAWN = Symbol("pawn");
const ROOK = Symbol("rook");
const KNIGHT = Symbol("knight");
const BISHOP = Symbol("bishop");
const QUEEN = Symbol("queen");
const KING = Symbol("king");


function turnOrder(board) {
  const side = board.activeSide;
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

class PawnRules {
  static figure = "♟";

  static validMoves(board, square) {
    const piece = board.pieces[square];
    const side = piece.color;

    const direction = side === WHITE ? 1 : -1;
    const validMoves = [new Position(square).offsetRank(direction).toString()];
    /*
    if (isEmptySquare(board, newSquare)) {
      validMoves.push(newSquare);
      if ([2, 7].includes(new Position(square).file)) {
        const newSquare = new Position(square).offsetFile(0).offsetRank(direction*2).toString();
        if (isEmptySquare(board, newSquare)) {
          validMoves.push(newSquare);
        }
      }
    }

    for (const drank of [-1, 1]) {
      const newSquare = new Position(square).offsetFile(drank).offsetRank(direction).toString();
      if (hasOpposingPiece(board, newSquare, piece.props.color)) {
        validMoves.push(newSquare);
      }
      if (newSquare === board.state.enPassant[0] && hasOpposingPiece(board, board.state.enPassant[1], piece.props.color)) {
        validMoves.push(newSquare);
      }
    }*/
    return validMoves;
  }


  }

  static movePiece(board, square, newSquare) {
    const pieces = {...board.pieces};
    const piece = board.pieces[square];
    pieces[newSquare] = piece;
    delete pieces[square];

    return {...board, pieces: pieces};
  }
}

function initialBoardState() {
  return {
    pieces: {
      "a1": {pieceType: PAWN, color: WHITE},
      "b1": {pieceType: PAWN, color: WHITE},
      "c1": {pieceType: PAWN, color: WHITE},
      "b3": {pieceType: PAWN, color: BLACK},
    },
    activeSide: WHITE,
  }
}

const rules = {
  board: {type: "chess", ranks: 8, files: 8},
  sides: [WHITE, BLACK],
  turnOrder: turnOrder,
  initialBoardState: initialBoardState,
  pieces: {
    [PAWN]: PawnRules,
  }
}

const misc = {
'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
}

export {rules};
