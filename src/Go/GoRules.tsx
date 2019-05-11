import {BoardGameRules, BoardState, PieceState} from '../BoardGame/BoardGame'
import {Position, rankRange, fileRange} from '../BoardGameUtils/Position'
import {ObjectMap} from '../Utils/ObjectMap';

const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
const NOCOLOR = "";

import './Go.css';

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
    return [square];
  }
  static movePiece(board: GoBoardState, square: string, newSquare: string): GoBoardState {
    const pieces ={...board.pieces, [newSquare]: {pieceType: EMPTY, color: NOCOLOR}}
    return {...board, pieces :pieces};
  }
}

class EmptyRules {
  static figure =  " ";
  static validMoves(_: GoBoardState, square: string): Array<string> {
    return [square];
  }
  static movePiece(board: GoBoardState, _: string, newSquare: string): GoBoardState {
    const pieces = {...board.pieces, [newSquare]: {pieceType: STONE, color: board.activeSide}};
    return {...board, activeSide: board.activeSide === WHITE ? BLACK : WHITE, pieces: pieces};
  }
}


function initialBoardState(): GoBoardState {
  let pieces: ObjectMap<PieceState> = {};
  for(const rank of rankRange(19)) {
    for(const file of fileRange(19)) {
      const square = new Position(file + rank).toString();
      pieces[square] = {pieceType: EMPTY, color: NOCOLOR};
    }
  }
  return {
    pieces: pieces,
    activeSide: BLACK,
  }
}

const rules: BoardGameRules<GoBoardState> = {
  board: {ranks: 19, files: 19, style: "go"},
  pieces: {
      [STONE]: StoneRules,
      [EMPTY]: EmptyRules,
  },
  initialBoardState: initialBoardState,
  selectors: [],
}

export {rules}
