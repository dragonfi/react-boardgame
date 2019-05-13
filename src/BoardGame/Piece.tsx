import React, { Component, ReactElement } from 'react';

export {Piece};

export interface PieceProps {
  color: string;
  figure: string | ReactElement;
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
