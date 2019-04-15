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

function idAdd(id, dcol, drow) {
  var col = cols.indexOf(id[0]);
  var row = Number(id[1]);
  col += dcol;
  row += drow;
  return '' + cols[col] + row;
}

class Chess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.pieces = {...initialBoardState};
    this.state.highlighted = [];
    this.state.highlightedPiece = '';
  }
  highlightMoves(id, piece) {
    if (!piece) {
      this.setState({highlighted: [], highlightedPiece: ''});
      this.forceUpdate();
      return;
    }
    var highlighted = [];
    if (piece === "wP") {
      highlighted.push(idAdd(id, 0, 1));
    }
    if (piece === "bP") {
      highlighted.push(idAdd(id, 0, -1));
    }
    if (piece[1] === "K") {
      for (const i of [-1, 0, 1]) {
        for (const j of [-1, 0, 1]) {
          if (i === 0 && j === 0) {
            continue;
          }
          highlighted.push(idAdd(id, i, j));
        }
      }
    }
    if (piece[1] === "Q") {
      for (const i of [1, 2, 3, 4, 5, 6, 7]) {
        highlighted.push(idAdd(id, i, i));
        highlighted.push(idAdd(id, 0, i));
        highlighted.push(idAdd(id, -i, i));
        highlighted.push(idAdd(id, i, 0));
        highlighted.push(idAdd(id, -i, 0));
        highlighted.push(idAdd(id, i, -i));
        highlighted.push(idAdd(id, 0, -i));
        highlighted.push(idAdd(id, -i, -i));
      }
    }
    if (piece[1] === "B") {
      for (const i of [1, 2, 3, 4, 5, 6, 7]) {
        highlighted.push(idAdd(id, i, i));
        highlighted.push(idAdd(id, -i, i));
        highlighted.push(idAdd(id, i, -i));
        highlighted.push(idAdd(id, -i, -i));
      }
    }
    if (piece[1] === "N") {
      highlighted.push(idAdd(id, -1, -2));
      highlighted.push(idAdd(id, -1, 2));
      highlighted.push(idAdd(id, 1, -2));
      highlighted.push(idAdd(id, 1, 2));
      highlighted.push(idAdd(id, 2, -1));
      highlighted.push(idAdd(id, 2, 1));
      highlighted.push(idAdd(id, -2, -1));
      highlighted.push(idAdd(id, -2, 1));
    }
    if (piece[1] === "R") {
      for (const i of [1, 2, 3, 4, 5, 6, 7]) {
        highlighted.push(idAdd(id, 0, i));
        highlighted.push(idAdd(id, i, 0));
        highlighted.push(idAdd(id, -i, 0));
        highlighted.push(idAdd(id, 0, -i));
      }
    }
    this.setState({highlighted: highlighted, highlightedPiece: id});
    this.forceUpdate();
  }

  renderCell(alpha, numeric) {
    var id = "" + alpha + numeric;
    var piece = this.state.pieces[id];
    var pieceRepr = reprPiece(piece);
    var highlighted = '';
    if (this.state.highlighted.includes(id)) {
      highlighted = 'highlighted';
    }
    console.log(this.state.highlightedPiece, id);
    if (this.state.highlightedPiece === id) {
      highlighted = 'highlighted-piece';
    }
    var onClick = (e) => this.highlightMoves(id, piece);
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
