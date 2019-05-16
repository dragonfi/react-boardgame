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

class EnumeratedMovePieceRules extends PieceRules {
  static moves: Array<Array<number>> = [[0, 0]];
  static validMoves(board: ShogiBoardState, square: string): Array<string> {
    const piece = board.pieces[square];

    const validMoves = [];
    const _moves = piece.color === BLACK ? this.moves : this._flipSingleMoves();
    for (const [dFile, dRank] of _moves) {
      const newSquare = new Position(square).offsetFile(dFile).offsetRank(dRank).toString();
      if (!hasFriendlyPiece(board, newSquare, piece.color)) {
        validMoves.push(newSquare);
      }
    }
    return validMoves;
  }
  static _flipSingleMoves(): Array<Array<number>> {
    return this.moves.map((pair) => [pair[0], pair[1] * -1]);
  }
}

class RangingPieceRules extends PieceRules {
  static directions: Array<Array<number>> = [[0, 0]];
  static validMoves(board: ShogiBoardState, square: string): Array<string> {
    const piece = board.pieces[square];

    const validMoves = [];
    const _directions = piece.color === BLACK ? this.directions : this._flipDirections();
    for (const [dFile, dRank] of _directions) {
      for(let i = 1; i < 9; i++) {
        const newSquare = new Position(square).offsetFile(dFile*i).offsetRank(dRank*i).toString();
        if (hasFriendlyPiece(board, newSquare, piece.color)) {
          break;
        }
        validMoves.push(newSquare);
        if (hasOpposingPiece(board, newSquare, piece.color)) {
          break;
        }
      }
    }
    return validMoves;
  }

  static _flipDirections(): Array<Array<number>> {
    return this.directions.map((pair) => [pair[0], pair[1] * -1]);
  }
}

class KingRules extends EnumeratedMovePieceRules {
  static figure = "王";
  static moves = [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [0, -1], [-1, -1]];
}

class GoldRules extends EnumeratedMovePieceRules {
  static figure = "金";
  static moves = [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [0, -1]];
}

class SilverRules extends EnumeratedMovePieceRules {
  static figure = "銀";
  static moves = [[1, 1], [0, 1], [-1, 1], [1, -1], [-1, -1]];
}

class KnightRules extends EnumeratedMovePieceRules {
  static figure = "桂";
  static moves = [[1, 2], [-1, 2]];
}

class PawnRules extends EnumeratedMovePieceRules {
  static figure = "歩";
  static moves = [[0, 1]];
}

class LanceRules extends RangingPieceRules {
  static figure = "香";
  static directions = [[0, 1]];
}

class BishopRules extends RangingPieceRules {
  static figure = "角";
  static directions = [[-1, 1], [1, 1], [-1, -1], [1, -1]];
}

class RookRules extends RangingPieceRules {
  static figure = "飛";
  static directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];
}

class DragonRules extends PieceRules {
  static figure = "竜";
}

class HorseRules extends PieceRules {
  static figure = "馬";
}

class PromotedSilverRules extends GoldRules {
  static figure = "全";
}

class PromotedKnightRules extends GoldRules {
  static figure = "今";
}

class PromotedLanceRules extends GoldRules {
  static figure = "仝";
}

class TokinRules extends GoldRules {
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
