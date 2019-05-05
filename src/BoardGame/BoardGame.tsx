import React, { Component } from 'react';

import {Board, BoardShape} from "./Board";
import {PieceSelector, PieceSelectorOption} from "./PieceSelector";
import {PieceProps} from "./Piece";
import './BoardGame.css';

export {BoardGame};

interface ObjectMap<T> {
  [key: string]: T;
}

function mapValues<T1, T2>(object: ObjectMap<T1>, fn: (item: T1) => T2): ObjectMap<T2> {
  return Object.assign(
    {}, ...Object.keys(object).map(
      k => ({[k]: fn(object[k] as any)})
    )
  );
}

export interface PieceState {
  pieceType: string;
  color: string;
}

export interface BoardState {
  pieces: {
    [square: string]: PieceState;
  },
  activeSide: string;
}

export interface PieceRules<TBoardState extends BoardState> {
  figure: string;
  validMoves(board: TBoardState, square: string): Array<string>;
  movePiece(board: TBoardState, square: string, newSquare: String): TBoardState;
}

export interface BoardGameRules<TBoardState extends BoardState> {
  board: BoardShape;
  initialBoardState(): TBoardState;
  pieces: {
    [piece: string]: PieceRules<TBoardState>;
  };
  selectors: Array<PieceSelectorRules<TBoardState>>;
}

export interface PieceSelectorRules<TBoardState extends BoardState> {
  condition(board: TBoardState): boolean;
  options(board: TBoardState): Array<PieceState>;
  handleResult(board: TBoardState, result: PieceState): TBoardState;
}

interface BoardGameProps<TBoardState extends BoardState, TRules extends BoardGameRules<TBoardState>> {
  rules: TRules;
}

interface BoardGameState<TBoardState extends BoardState> {
  board: TBoardState;
  highlightedPiece: string;
  highlightedMoves: Array<string>;
}

class BoardGame<TRules extends BoardGameRules<TState>, TState extends BoardState>
  extends Component<BoardGameProps<TState, TRules>, BoardGameState<TState>> {
  constructor(props: BoardGameProps<TState, TRules>) {
    const rules = props.rules;
    super(props);
    this.state = {
      board: rules.initialBoardState(),
      highlightedPiece: '',
      highlightedMoves: [],
    };
  }
  _pieceRepresentation(piece: PieceState): PieceProps {
    return {
      ...piece,
      figure: this.props.rules.pieces[piece.pieceType].figure,
    }
  }

  _highlightMoves(square: string): void {
    const piece = this.state.board.pieces[square];
    if (!piece) {
      this.setState({highlightedMoves: [], highlightedPiece: ''});
      return;
    }
    this.setState({
      highlightedMoves: this.props.rules.pieces[piece.pieceType].validMoves(this.state.board, square),
      highlightedPiece: square,
    });
  }

  _movePiece(newSquare: string) {
    const square = this.state.highlightedPiece;
    const piece = this.state.board.pieces[square];
    const newBoard: TState = this.props.rules.pieces[piece.pieceType].movePiece(this.state.board, square, newSquare);
    this.setState({
      board: newBoard,
      highlightedMoves: [],
      highlightedPiece: '',
    });
  }

  _onSquareClick(square: string) {
    if (this.state.highlightedMoves.includes(square)) {
      this._movePiece(square);
    } else {
      this._highlightMoves(square);
    }
  }

  _onOptionClick(selector: PieceSelectorRules<TState>, result: PieceSelectorOption) {
    this.setState({
      board: selector.handleResult(this.state.board, result.state),
    });
  }

  _firstActiveSelector() {
    return this.props.rules.selectors.find((selector) => selector.condition(this.state.board));
  }

  _addFigureToSelectorOption(state: PieceState): PieceSelectorOption {
    console.log(state, this.props.rules.pieces);
    return {state: {...state}, figure: this.props.rules.pieces[state.pieceType].figure};
  }

  _renderActiveSelector() {
    const selector = this._firstActiveSelector();
    if (!selector) {
      return null;
    }
    const options: Array<PieceSelectorOption> = selector.options(this.state.board).map(this._addFigureToSelectorOption.bind(this));
    return <PieceSelector options={options} onOptionClick={this._onOptionClick.bind(this, selector)} />
  }

  render() {
    const boardRules = this.props.rules.board;
    const pieces = this.state.board.pieces;
    const pieceReprs: ObjectMap<PieceProps> = mapValues(pieces, (v) => this._pieceRepresentation(v));
    const highlightedSquares = [...this.state.highlightedMoves, this.state.highlightedPiece];
    return (
      <div className="react-boardgame">
        <Board shape={boardRules} pieces={pieceReprs} highlightedSquares={highlightedSquares} onSquareClick={this._onSquareClick.bind(this)}/>
        {this._renderActiveSelector()}
      </div>
    )
  }
}
