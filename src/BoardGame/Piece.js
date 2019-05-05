import React, { Component } from 'react';

export {Piece};

class Piece extends Component {
  render() {
    return (
      <div className={"react-boardgame__piece " + this.props.color}>
        {this.props.figure}
      </div>
    )
  }
}
