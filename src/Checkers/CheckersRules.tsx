import {BoardState, BoardGameRules, PieceState} from '../BoardGame/BoardGame';
import {Position} from '../BoardGameUtils/Position';
import {ObjectMap} from '../Utils/ObjectMap';

import './Checkers.css'

const WHITE = "react-boardgame--color-white";
const BLACK = "react-boardgame--color-black";

const MAN = "man";
const KING = "king";

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

let rules: BoardGameRules<CheckersBoardState> = {
  board: {ranks: 10, files: 10},
  initialBoardState: initialBoardState,
  pieces: {
    [MAN]: {
      figure: "⛂",
      validMoves: (_: CheckersBoardState, __: string) => [],
      movePiece: (board: CheckersBoardState, _: string, __: string) => board,
    },
  },
  selectors: [],
};

// Unicode figures: ⛀⛁⛂⛃

export {rules};
