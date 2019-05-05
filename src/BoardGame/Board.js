import React, { Component } from 'react';

import {rankRange, fileRange, Position} from "../BoardGameUtils/Position";
import {Square} from "./Square";

import './BoardGame.css';

export {Board};

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
    return <Square square={square.toString()} key={square.toString()} figure={figure} color={color} isHighlighted={isHighlighted} onClick={this.props.onSquareClick} />
  }
}
