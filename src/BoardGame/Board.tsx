import React, { Component } from 'react';

import {rankRange, fileRange, Position} from "../BoardGameUtils/Position";
import {Square} from "./Square";
import {PieceProps} from "./Piece";

import './BoardGame.css';

export {Board};

export interface BoardShape {
  ranks: number;
  files: number;
}

interface Pieces {
  [square: string]: PieceProps;
}

interface BoardProps {
  shape: BoardShape;
  pieces: Pieces;
  highlightedSquares: Array<string>;
  onSquareClick(square: string): any;
}

class Board extends Component<BoardProps> {
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

  _renderRank(rank: number) {
    const files = fileRange(this.props.shape.files);
    return (
      <tr key={rank}>
        {files.map(file => this._renderSquare(file, rank))}
      </tr>
    )
  }

  _renderSquare(file: string, rank: number) {
    const square = new Position("a1").setFile(file).setRank(rank).toString();
    const piece = this.props.pieces[square];
    const isHighlighted = this.props.highlightedSquares.includes(square.toString());
    return <Square square={square.toString()} key={square.toString()} piece={piece} isHighlighted={isHighlighted} onClick={this.props.onSquareClick} />
  }
}
