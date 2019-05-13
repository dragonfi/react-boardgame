import {BoardGameRules, BoardState, PieceState} from '../BoardGame/BoardGame'
import {Position, rankRange, fileRange} from '../BoardGameUtils/Position'
import {ObjectMap} from '../Utils/ObjectMap';

import React from 'react'

const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
const NOCOLOR = "";

import './Go.css';
import stoneSvg from './stone.svg';

function opposingColor(color: string): string {
  switch (color) {
    case WHITE: return BLACK;
    case BLACK: return WHITE;
    default: return NOCOLOR;
  }
}

const STONE = "stone";

interface GoBoardState extends BoardState {

}

class StoneRules {
  static figure =  <img src={stoneSvg} alt="⚫" />;
  static validMoves(board: GoBoardState, square: string): Array<string> {
    return [square];
  }
  static movePiece(board: GoBoardState, square: string, newSquare: string): GoBoardState {
    let pieces = {...board.pieces};
    delete pieces[newSquare];
    return {...board, pieces: pieces};
  }
}

function initialBoardState(): GoBoardState {
  return {
    pieces: {},
    activeSide: BLACK,
  }
}

function emptySquareMove(board: GoBoardState, square: string): GoBoardState {
  const pieces = {...board.pieces, [square]: {pieceType: STONE, color: board.activeSide}};
  return {...board, activeSide: board.activeSide === WHITE ? BLACK : WHITE, pieces: pieces};
}

const rules: BoardGameRules<GoBoardState> = {
  board: {ranks: 19, files: 19, style: "go"},
  pieces: {
      [STONE]: StoneRules,
  },
  emptySquareMove: emptySquareMove,
  initialBoardState: initialBoardState,
  selectors: [],
}

export {rules}
