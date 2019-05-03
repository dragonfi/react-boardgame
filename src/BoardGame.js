import React, { Component } from 'react';

import {rankRange, fileRange, Position} from "./ChessUtils.js"

 import './Chess.css';

class Board extends Component {
  // props: shape, pieces
  render() {
    const ranks = rankRange(this.props.shape.ranks);
    return (
      <table className="react-boardgame__board">
        <tbody>
          {ranks.map(rank => this._renderRank(rank))}
        </tbody>
      </table>
    );
  }

  _renderRank(rank) {
    const files = fileRange(this.props.shape.files);
    return (
      <tr key={rank}>
        {files.map(file => this._renderSquare(file, rank))}
      </tr>
    )
  }

  _renderSquare(file, rank) {
    const square = new Position("a1").setFile(file).setRank(rank);
    const piece = this.props.pieces[square];
    const figure = piece ? piece.figure : null;
    const color = piece ? piece.color : null;
    const isHighlighted = this.props.highlightedSquares.includes(square.toString());
    return <Square square={square.toString()} figure={figure} color={color} isHighlighted={isHighlighted} onClick={this.props.onSquareClick} />
  }
}

class Piece extends Component {
  render() {
    return (
      <div className={"react-boardgame__piece " + this.props.color}>
        {this.props.figure}
      </div>
    )
  }
}

class Square extends Component {
  render() {
    const square = this.props.square;
    const isHighlighted = this.props.isHighlighted ? "react-boardgame__square--highlighted" : "";
    return (
      <td className={"react-boardgame__square " + isHighlighted} title={square} key={square} onClick={(_) => this.props.onClick(square)}>
        <Piece color={this.props.color} figure={this.props.figure} />
      </td>
    )
  }
}

function mapValues(object, fn) {
  return Object.assign(
    {}, ...Object.keys(object).map(
      k => ({[k]: fn(object[k])})
    )
  );
}

class PieceSelector extends Component {
  _renderOption(option, index) {
    return (
      <div onClick={(e) => this.props.onOptionClick(option)} key={index}>
        <Piece color={option.color} figure={option.figure} />
      </div>
    )
  }

  render() {
    const e = window.event;
    const left = e.clientX + "px";
    const top = e.clientY + "px";
    const style = {position: "absolute", top: top, left: left};

    const options = this.props.options.map(this._renderOption.bind(this));

    return (
      <div className="react-boardgame__piece-selector" style={style}>
        {options}
      </div>
    )
  }
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

export {BoardGame};
