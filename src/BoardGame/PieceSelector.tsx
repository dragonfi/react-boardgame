import React, { Component, CSSProperties, ReactElement } from 'react';
import {Piece} from './Piece'


export {PieceSelector};

export interface PieceSelectorOption {
  figure: string | ReactElement;
  state: {
    pieceType: string;
    color: string;
  };
}

interface PieceSelectorProps {
  onOptionClick(option: PieceSelectorOption): void;
  options: Array<PieceSelectorOption>;
}

class PieceSelector extends Component<PieceSelectorProps> {
  _renderOption(option: PieceSelectorOption, index: number) {
    return (
      <div onClick={(_) => this.props.onOptionClick(option)} key={index}>
        <Piece color={option.state.color} figure={option.figure} />
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
