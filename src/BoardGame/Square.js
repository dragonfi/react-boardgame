import React, { Component } from 'react';
import {Piece} from './Piece';

export {Square};

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
