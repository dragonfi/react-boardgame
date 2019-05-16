import {BoardGameRules, BoardState, PieceRules} from '../BoardGame/BoardGame';

import './Shogi.css';

export {rules};

const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
//const NOCOLOR = "react-boardgame__piece--color-nocolor";

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

}

class KingRules {
  static figure = "王";
  static validMoves(_board: ShogiBoardState, _square: string): Array<string> {
    return [];
  }
  static movePiece(board: ShogiBoardState, _square: string, _newSquare: string): ShogiBoardState {
    return board;
  }
}

class GoldRules extends KingRules {
  static figure = "金";
}

class SilverRules extends KingRules {
  static figure = "銀";
}

class KnightRules extends KingRules {
  static figure = "桂";
}

class LanceRules extends KingRules {
  static figure = "香";
}

class BishopRules extends KingRules {
  static figure = "角";
}

class RookRules extends KingRules {
  static figure = "飛";
}

class PawnRules extends KingRules {
  static figure = "歩";
}

class DragonRules extends KingRules {
  static figure = "竜";
}

class HorseRules extends KingRules {
  static figure = "馬";
}

class PromotedSilverRules extends KingRules {
  static figure = "全";
}

class PromotedKnightRules extends KingRules {
  static figure = "今";
}

class PromotedLanceRules extends KingRules {
  static figure = "仝";
}

class TokinRules extends KingRules {
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
