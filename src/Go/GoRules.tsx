import {BoardGameRules, BoardState} from '../BoardGame/BoardGame'

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

const STONE = "stone";
const EMPTY = "empty";

interface GoBoardState extends BoardState {

}

class StoneRules {
  static figure =  "⚫";
  static validMoves(board: GoBoardState, square: string): Array<string> {
    return [];
  }
  static movePiece(board: GoBoardState, square: string, newSquare: string): GoBoardState {
    return board;
  }
}


function initialBoardState(): GoBoardState {
  return {
    pieces: {},
    activeSide: WHITE,
  }
}

const rules: BoardGameRules<GoBoardState> = {
  board: {ranks: 19, files: 19},
  pieces: {
      [STONE]: StoneRules,
      [EMPTY]: StoneRules,
  },
  initialBoardState: initialBoardState,
  selectors: [],
}

export {rules}
