import React, { Component } from 'react';

import './Chess.css';

function reprPiece(code) {
  const reprs = {
    'wK': '♔',
    'wQ': '♕',
    'wR': '♖',
    'wB': '♗',
    'wN': '♘',
    'wP': '♙',
    'bK': '♚',
    'bQ': '♛',
    'bR': '♜',
    'bB': '♝',
    'bN': '♞',
    'bP': '♟',
  }
  return reprs[code];
}

const initialBoardState = {
  'a8': 'bR',
  'b8': 'bN',
  'c8': 'bB',
  'd8': 'bQ',
  'e8': 'bK',
  'f8': 'bB',
  'g8': 'bN',
  'h8': 'bR',
  'a7': 'bP',
  'b7': 'bP',
  'c7': 'bP',
  'd7': 'bP',
  'e7': 'bP',
  'f7': 'bP',
  'g7': 'bP',
  'h7': 'bP',

  'a1': 'wR',
  'b1': 'wN',
  'c1': 'wB',
  'd1': 'wQ',
  'e1': 'wK',
  'f1': 'wB',
  'g1': 'wN',
  'h1': 'wR',
  'a2': 'wP',
  'b2': 'wP',
  'c2': 'wP',
  'd2': 'wP',
  'e2': 'wP',
  'f2': 'wP',
  'g2': 'wP',
  'h2': 'wP',
};

class Chess extends Component {
  constructor(props) {
    super(props);
    this.pieces = {...initialBoardState};
  }
  render() {
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = [8, 7, 6, 5, 4, 3, 2, 1];
    var cells = rows.map((n) =>
      <tr>{cols.map((a) =>
        <td title={"" + n + a}>{reprPiece(this.pieces["" + a + n])}</td>
      )}</tr>);
    return (
      <table class="react-chess-game">
        {cells}
      </table>
    )
  }
}

export default Chess;
