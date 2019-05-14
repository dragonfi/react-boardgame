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

function squareColor(board: BoardState, square: string): string {
  const piece = board.pieces[square];
  return piece ? piece.color : NOCOLOR;
}

function hasFriendlyPiece(board: BoardState, square: string, color: string): boolean {
  return squareColor(board, square) === color;
}

const STONE = "stone";

interface GoBoardState extends BoardState {
  prisoners: ObjectMap<number>;
}

class StoneRules {
  static figure =  <img src={stoneSvg} alt="⚫" />;
  static validMoves(board: GoBoardState, square: string): Array<string> {
    return this._stonesFromSameGroup(board, square);
  }

  static movePiece(board: GoBoardState, square: string, newSquare: string): GoBoardState {
    let pieces = {...board.pieces};
    const color = board.pieces[newSquare].color;
    let prisoners = {...board.prisoners};
    const stonesToRemove = this._stonesFromSameGroup(board, newSquare);
    for (const stone of stonesToRemove) {
      prisoners[color] = prisoners[color] ? prisoners[color] + 1 : 0;
      delete pieces[stone];
    }
    return {...board, pieces: pieces, prisoners: prisoners};
  }

  static _stonesFromSameGroup(board: GoBoardState, square: string): Array<string> {
    const origin = new Position(square);
    let stonesFromSameGroup = new Set([origin.toString()]);

    for(let i = 0; i < 40; i++) {
      let newStones = this._addNeighbours(board, stonesFromSameGroup);
      if (this._setsEqual(newStones, stonesFromSameGroup)) {
        break;
      }
      for (const newStone of Array.from(newStones)) {
        stonesFromSameGroup.add(newStone);
      }
    }
    return Array.from(stonesFromSameGroup);
  }

  static _setsEqual<T>(first: Set<T>, second: Set<T>): Boolean {
    for (const item of Array.from(first)) {
      if (!second.has(item)) {
        return false;
      };
    }
    for (const item of Array.from(second)) {
      if (!first.has(item)) {
        return false;
      };
    }
    return true;
  }

  static _addNeighbours(board: GoBoardState, stones: Set<string>): Set<string> {
    let result = new Set(stones);
    for (const stone of Array.from(stones)) {
      for (const neighbour of this._friendlyNeighbours(board, stone)) {
        result.add(neighbour);
      }
    }
    return result;
  }

  static _friendlyNeighbours(board: GoBoardState, position: string): Array<string> {
    let results: Array<string> = [];
    const _position = new Position(position);
    const stone = board.pieces[position];
    if (!stone) {
      return [];
    }
    const color = stone.color;
    for(const candidate of [_position.offsetFile(1), _position.offsetFile(-1), _position.offsetRank(1), _position.offsetRank(-1)]) {
      if(hasFriendlyPiece(board, candidate.toString(), color)) {
        results.push(candidate.toString());
      }
    }
    return results;
  }
}

function initialBoardState(): GoBoardState {
  return {
    pieces: {},
    activeSide: BLACK,
    prisoners: {
      [WHITE]: 0,
      [BLACK]: 0,
    }
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
