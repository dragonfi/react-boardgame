import React, { Component } from 'react';
import {Piece, PieceProps} from './Piece';

export {Square};

interface SquareProps {
  piece: PieceProps | null;
  square: string;
  isHighlighted: boolean;
  onClick(square: string): null;
}

class Square extends Component<SquareProps> {
  _renderPiece(piece: PieceProps | null) {
    return piece ? <Piece color={piece.color} figure={piece.figure} /> : null;
  }
  render() {
    const square = this.props.square;
    const isHighlighted = this.props.isHighlighted ? "react-boardgame__square--highlighted" : "";
    return (
      <td className={"react-boardgame__square " + isHighlighted} title={square} key={square} onClick={(_) => this.props.onClick(square)}>
        {this._renderPiece(this.props.piece)}
      </td>
    )
  }
}
