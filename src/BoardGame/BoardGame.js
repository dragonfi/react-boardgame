import React, { Component } from 'react';

import {Board} from "./Board";
import {PieceSelector} from "./PieceSelector";

import './BoardGame.css';

export {BoardGame};

function mapValues(object, fn) {
  return Object.assign(
    {}, ...Object.keys(object).map(
      k => ({[k]: fn(object[k])})
    )
  );
}

class BoardGame extends Component {
  constructor(props) {
    const rules = props.rules;
    super(props);
    this.state = {
      board: rules.initialBoardState(),
      highlightedPiece: '',
      highlightedMoves: [],
    };
  }
  _pieceRepresentation(piece) {
    return {
      ...piece,
      figure: this.props.rules.pieces[piece.pieceType].figure,
    }
  }

  _highlightMoves(square) {
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

  _movePiece(newSquare) {
    const square = this.state.highlightedPiece;
    const piece = this.state.board.pieces[square];
    const newBoard = this.props.rules.pieces[piece.pieceType].movePiece(this.state.board, square, newSquare);
    this.setState({
      board: newBoard,
      highlightedMoves: [],
      highlightedPiece: '',
    });
  }

  _onSquareClick(square) {
    if (this.state.highlightedMoves.includes(square)) {
      this._movePiece(square);
    } else {
      this._highlightMoves(square);
    }
  }

  _onOptionClick(selector, result) {
    this.setState({
      board: selector.handleResult(this.state.board, result),
    });
  }

  _firstActiveSelector() {
    return this.props.rules.selectors.find((selector) => selector.condition(this.state.board));
  }

  _addFigureToSelectorOption(option) {
    return {...option, figure: this.props.rules.pieces[option.pieceType].figure};
  }

  _renderActiveSelector() {
    const selector = this._firstActiveSelector();
    if (!selector) {
      return null;
    }
    const options = selector.options(this.state.board).map(this._addFigureToSelectorOption.bind(this));
    return <PieceSelector options={options} onOptionClick={this._onOptionClick.bind(this, selector)} />
  }

  render() {
    const boardRules = this.props.rules.board;
    const pieces = this.state.board.pieces;
    const pieceReprs = mapValues(pieces, (v) => this._pieceRepresentation(v));
    const highlightedSquares = [...this.state.highlightedMoves, this.state.highlightedPiece];
    return (
      <div className="react-boardgame">
        <Board shape={boardRules} pieces={pieceReprs} highlightedSquares={highlightedSquares} onSquareClick={this._onSquareClick.bind(this)}/>
        {this._renderActiveSelector()}
      </div>
    )
  }
}
