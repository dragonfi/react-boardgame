import {BoardGameRules, BoardState, PieceState} from '../BoardGame/BoardGame';
import {Position} from '../BoardGameUtils/Position';
import {ObjectMap} from '../Utils/ObjectMap';

import './Shogi.css';

export {rules};

const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
const NOCOLOR = "react-boardgame__piece--color-nocolor";

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


const KING = "王";
const GOLD = "金";
const SILVER = "銀";
const KNIGHT = "桂";
const LANCE = "香";
const BISHOP = "角";
const ROOK = "飛";
const PAWN = "歩";

const DRAGON = "竜";
const HORSE = "馬";
const PROMOTED_SILVER = "全";
const PROMOTED_KNIGHT = "今";
const PROMOTED_LANCE = "仝";
const TOKIN = "と";


interface ShogiBoardState extends BoardState {
  hand: ObjectMap<Array<PieceState>>;
}

class PieceRules {
  static figure = " ";

  static validMoves(board: ShogiBoardState, square: string): Array<string> {
    return [];
  }

  static movePiece(board: ShogiBoardState, square: string, newSquare: string): ShogiBoardState {
    let pieces = {...board.pieces};
    let hand = {...board.hand};
    const piece = board.pieces[square];

    const removedPiece = board.pieces[newSquare];
    if (removedPiece) {
      hand[piece.color].push({pieceType: removedPiece.pieceType, color: piece.color});
    }

    delete pieces[square];
    pieces[newSquare] = piece;

    return {...board, pieces: pieces, hand: hand};
  }
}

class KingRules extends PieceRules {
  static figure = "王";
  static validMoves(board: ShogiBoardState, square: string): Array<string> {
    const piece = board.pieces[square];

    const validMoves = [];
    for (const [dFile, dRank] of [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [0, -1], [-1, -1]]) {
      const newSquare = new Position(square).offsetFile(dFile).offsetRank(dRank).toString();
      if (!hasFriendlyPiece(board, newSquare, piece.color)) {
        validMoves.push(newSquare);
      }
    }
    return validMoves;
  }
}

class GoldRules extends PieceRules {
  static figure = "金";
}

class SilverRules extends PieceRules {
  static figure = "銀";
}

class KnightRules extends PieceRules {
  static figure = "桂";
}

class LanceRules extends PieceRules {
  static figure = "香";
}

class BishopRules extends PieceRules {
  static figure = "角";
}

class RookRules extends PieceRules {
  static figure = "飛";
}

class PawnRules extends PieceRules {
  static figure = "歩";
}

class DragonRules extends PieceRules {
  static figure = "竜";
}

class HorseRules extends PieceRules {
  static figure = "馬";
}

class PromotedSilverRules extends PieceRules {
  static figure = "全";
}

class PromotedKnightRules extends PieceRules {
  static figure = "今";
}

class PromotedLanceRules extends PieceRules {
  static figure = "仝";
}

class TokinRules extends PieceRules {
  static figure = "と"
}

function initialBoardState(): ShogiBoardState {

  return {
    pieces: {
      "e1": {pieceType: KING, color: BLACK},
      "d1": {pieceType: GOLD, color: BLACK},
      "f1": {pieceType: GOLD, color: BLACK},
      "c1": {pieceType: SILVER, color: BLACK},
      "g1": {pieceType: SILVER, color: BLACK},
      "b1": {pieceType: KNIGHT, color: BLACK},
      "h1": {pieceType: KNIGHT, color: BLACK},
      "a1": {pieceType: LANCE, color: BLACK},
      "i1": {pieceType: LANCE, color: BLACK},

      "b2": {pieceType: BISHOP, color: BLACK},
      "h2": {pieceType: ROOK, color: BLACK},

      "a3": {pieceType: PAWN, color: BLACK},
      "b3": {pieceType: PAWN, color: BLACK},
      "c3": {pieceType: PAWN, color: BLACK},
      "d3": {pieceType: PAWN, color: BLACK},
      "e3": {pieceType: PAWN, color: BLACK},
      "f3": {pieceType: PAWN, color: BLACK},
      "g3": {pieceType: PAWN, color: BLACK},
      "h3": {pieceType: PAWN, color: BLACK},
      "i3": {pieceType: PAWN, color: BLACK},

      "a7": {pieceType: PAWN, color: WHITE},
      "b7": {pieceType: PAWN, color: WHITE},
      "c7": {pieceType: PAWN, color: WHITE},
      "d7": {pieceType: PAWN, color: WHITE},
      "e7": {pieceType: PAWN, color: WHITE},
      "f7": {pieceType: PAWN, color: WHITE},
      "g7": {pieceType: PAWN, color: WHITE},
      "h7": {pieceType: PAWN, color: WHITE},
      "i7": {pieceType: PAWN, color: WHITE},

      "b8": {pieceType: ROOK, color: WHITE},
      "h8": {pieceType: BISHOP, color: WHITE},

      "e9": {pieceType: KING, color: WHITE},
      "d9": {pieceType: GOLD, color: WHITE},
      "f9": {pieceType: GOLD, color: WHITE},
      "c9": {pieceType: SILVER, color: WHITE},
      "g9": {pieceType: SILVER, color: WHITE},
      "b9": {pieceType: KNIGHT, color: WHITE},
      "h9": {pieceType: KNIGHT, color: WHITE},
      "a9": {pieceType: LANCE, color: WHITE},
      "i9": {pieceType: LANCE, color: WHITE},
    },
    activeSide: BLACK,
    hand: {
      [WHITE]: [],
      [BLACK]: [],
    }
  }
}

const rules: BoardGameRules<ShogiBoardState> = {
  board: {ranks: 9, files: 9, style: 'shogi'},
  pieces: {
    [KING]: KingRules,
    [GOLD]: GoldRules,
    [SILVER]: SilverRules,
    [KNIGHT]: KnightRules,
    [LANCE]: LanceRules,
    [BISHOP]: BishopRules,
    [ROOK]: RookRules,
    [PAWN]: PawnRules,
    [DRAGON]: DragonRules,
    [HORSE]: HorseRules,
    [PROMOTED_SILVER]: PromotedSilverRules,
    [PROMOTED_KNIGHT]: PromotedKnightRules,
    [PROMOTED_LANCE]: PromotedLanceRules,
    [TOKIN]: TokinRules,
  },
  initialBoardState: initialBoardState,
  selectors: [],
  sideIndicators: [],
  emptySquareMove: (board: ShogiBoardState, _: string) => board,
}
