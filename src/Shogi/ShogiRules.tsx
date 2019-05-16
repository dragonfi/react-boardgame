import {BoardGameRules, BoardState} from '../BoardGame/BoardGame';

export {rules};

//const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
//const NOCOLOR = "react-boardgame__piece--color-nocolor";


interface ShogiBoardState extends BoardState {

}

const rules: BoardGameRules<ShogiBoardState> = {
  board: {ranks: 9, files: 9, style: 'shogi'},
  pieces: {},
  initialBoardState: () => ({pieces: {}, activeSide: BLACK}),
  selectors: [],
  sideIndicators: [],
  emptySquareMove: (board: ShogiBoardState, _: string) => board,
}
