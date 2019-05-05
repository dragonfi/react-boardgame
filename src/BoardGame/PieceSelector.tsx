import React, { Component, CSSProperties } from 'react';
import {Piece} from './Piece'

export {PieceSelector};

interface Option {
  color: string;
  figure: string;
}

interface PieceSelectorProps {
  onOptionClick(option: Option): null;
  options: Array<Option>;
}

class PieceSelector extends Component<PieceSelectorProps> {
  _renderOption(option: Option, index: number) {
    return (
      <div onClick={(e) => this.props.onOptionClick(option)} key={index}>
        <Piece color={option.color} figure={option.figure} />
      </div>
    )
  }

  render() {
    const e: Event | undefined = window.event;

    const left = e instanceof MouseEvent ? e.clientX + "px": 0;
    const top = e instanceof MouseEvent ? e.clientY + "px": 0;

    const style: CSSProperties = {position: "absolute", top: top, left: left};

    const options = this.props.options.map(this._renderOption.bind(this));

    return (
      <div className="react-boardgame__piece-selector" style={style}>
        {options}
      </div>
    )
  }
}
