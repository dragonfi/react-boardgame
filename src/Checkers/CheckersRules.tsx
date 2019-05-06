
import {BoardState, BoardGameRules} from '../BoardGame/BoardGame';


interface CheckersBoardState extends BoardState {
}

let rules: BoardGameRules<CheckersBoardState> = {
  board: {ranks: 10, files: 10},
  initialBoardState: () => ({pieces: {}, activeSide: ""}),
  pieces: {},
  selectors: [],
};

export {rules};
