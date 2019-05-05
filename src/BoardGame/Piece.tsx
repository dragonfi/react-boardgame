import React, { Component } from 'react';

export {Piece};

interface PieceProps {
  color: string;
  figure: string;
}

class Piece extends Component<PieceProps> {
  render() {
    return (
      <div className={"react-boardgame__piece " + this.props.color}>
        {this.props.figure}
      </div>
    )
  }
}
