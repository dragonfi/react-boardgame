import React, { Component } from 'react';

export {Piece};

export interface PieceProps {
  color: string | null;
  figure: string | null;
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
