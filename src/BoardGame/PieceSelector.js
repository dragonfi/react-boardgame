import React, { Component } from 'react';
import {Piece} from './Piece'

export {PieceSelector};

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
