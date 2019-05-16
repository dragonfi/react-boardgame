import {BoardGameRules, BoardState, PieceRules} from '../BoardGame/BoardGame';

import './Shogi.css';

export {rules};

const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
//const NOCOLOR = "react-boardgame__piece--color-nocolor";

const KING = "王";
const GOLD = "金";


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

function initialBoardState(): ShogiBoardState {
  return {
    pieces: {
      "e1": {pieceType: KING, color: BLACK},
      "d1": {pieceType: GOLD, color: BLACK},
      "f1": {pieceType: GOLD, color: BLACK},
      "e9": {pieceType: KING, color: WHITE},
      "d9": {pieceType: GOLD, color: WHITE},
      "f9": {pieceType: GOLD, color: WHITE},
    },
    activeSide: BLACK,
  }
}

const rules: BoardGameRules<ShogiBoardState> = {
  board: {ranks: 9, files: 9, style: 'shogi'},
  pieces: {
    [KING]: KingRules,
    [GOLD]: GoldRules,
  },
  initialBoardState: initialBoardState,
  selectors: [],
  sideIndicators: [],
  emptySquareMove: (board: ShogiBoardState, _: string) => board,
}
