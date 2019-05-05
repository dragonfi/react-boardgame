import React, { Component } from 'react';

import {Board, BoardShape} from "./Board";
import {PieceSelector} from "./PieceSelector";
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

interface PieceState {
  pieceType: string;
  color: string;
}

export interface BoardState {
  pieces: {
    [square: string]: PieceState;
  }
}

interface PieceRules {
  figure: string;
  validMoves(board: BoardState, square: string): Array<string>;
  movePiece(board: BoardState, square: string, newSquare: String): BoardState;
}

export interface BoardGameRules {
  board: BoardShape;
  initialBoardState(): BoardState;
  pieces: {
    [piece: string]: PieceRules;
  };
  selectors: Array<PieceSelectorRules>;
}

interface BoardGameProps {
  rules: BoardGameRules;
}

interface BoardGameState {
  board: BoardState;
  highlightedPiece: string;
  highlightedMoves: Array<string>;
}

interface PieceSelectorRules {
  condition(board: BoardState): boolean;
  options(board: BoardState): Array<PieceState>;
  handleResult(board: BoardState, result: PieceProps): BoardState;
}

class BoardGame extends Component<BoardGameProps, BoardGameState> {
  constructor(props: BoardGameProps) {
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
    const newBoard = this.props.rules.pieces[piece.pieceType].movePiece(this.state.board, square, newSquare);
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

  _onOptionClick(selector: PieceSelectorRules, result: PieceProps) {
    this.setState({
      board: selector.handleResult(this.state.board, result),
    });
  }

  _firstActiveSelector() {
    return this.props.rules.selectors.find((selector) => selector.condition(this.state.board));
  }

  _addFigureToSelectorOption(option: PieceState): PieceProps {
    return {...option, figure: this.props.rules.pieces[option.pieceType].figure};
  }

  _renderActiveSelector() {
    const selector = this._firstActiveSelector();
    if (!selector) {
      return null;
    }
    const options: Array<PieceProps> = selector.options(this.state.board).map(this._addFigureToSelectorOption.bind(this));
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
