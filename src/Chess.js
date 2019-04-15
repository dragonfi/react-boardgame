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

const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const rows = [8, 7, 6, 5, 4, 3, 2, 1];

class Chess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.pieces = {...initialBoardState};
    this.state.highlighted = ['a1'];
  }
  highlightMoves(alpha, numeric, piece) {
    var id = "" + alpha + numeric;
    console.log(id);
    this.setState({highlighted: this.state.highlighted.concat(id)});
    this.forceUpdate();
  }

  renderCell(alpha, numeric) {
    var id = "" + alpha + numeric;
    var piece = this.state.pieces[id];
    var pieceRepr = reprPiece(piece);
    console.log(id, this.state.highlighted);
    var highlighted = this.state.highlighted.includes(id) ? 'highlighted' : '';
    var onClick = (e) => this.highlightMoves(alpha, numeric, piece);
    return <td className={highlighted} title={id} key={id} onClick={onClick}>{pieceRepr}</td>;

  }

  renderRow(numeric) {
    return <tr>{cols.map(alpha => this.renderCell(alpha, numeric))}</tr>
  }

  renderBoard() {
    return (<table className="react-chess-game"><tbody>
      {rows.map(numeric => this.renderRow(numeric))}
    </tbody></table>)
  }

  render() {
    return this.renderBoard();
  }
}

export default Chess;
