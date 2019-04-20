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

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

function squareAdd(square, dfile, drank) {
  var file = files.indexOf(square[0]);
  var rank = Number(square[1]);
  file += dfile;
  rank += drank;
  return '' + files[file] + rank;
}

class Chess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.pieces = {...initialBoardState};
    this.state.highlighted = [];
    this.state.highlightedPiece = '';
  }
  highlightMoves(square, piece) {
    if (!piece) {
      this.setState({highlighted: [], highlightedPiece: ''});
      this.forceUpdate();
      return;
    }
    var highlighted = [];
    if (piece === "wP") {
      highlighted.push(squareAdd(square, 0, 1));
    }
    if (piece === "bP") {
      highlighted.push(squareAdd(square, 0, -1));
    }
    if (piece[1] === "K") {
      for (const i of [-1, 0, 1]) {
        for (const j of [-1, 0, 1]) {
          if (i === 0 && j === 0) {
            continue;
          }
          highlighted.push(squareAdd(square, i, j));
        }
      }
    }
    if (piece[1] === "Q") {
      for (const i of [1, 2, 3, 4, 5, 6, 7]) {
        highlighted.push(squareAdd(square, i, i));
        highlighted.push(squareAdd(square, 0, i));
        highlighted.push(squareAdd(square, -i, i));
        highlighted.push(squareAdd(square, i, 0));
        highlighted.push(squareAdd(square, -i, 0));
        highlighted.push(squareAdd(square, i, -i));
        highlighted.push(squareAdd(square, 0, -i));
        highlighted.push(squareAdd(square, -i, -i));
      }
    }
    if (piece[1] === "B") {
      for (const i of [1, 2, 3, 4, 5, 6, 7]) {
        highlighted.push(squareAdd(square, i, i));
        highlighted.push(squareAdd(square, -i, i));
        highlighted.push(squareAdd(square, i, -i));
        highlighted.push(squareAdd(square, -i, -i));
      }
    }
    if (piece[1] === "N") {
      highlighted.push(squareAdd(square, -1, -2));
      highlighted.push(squareAdd(square, -1, 2));
      highlighted.push(squareAdd(square, 1, -2));
      highlighted.push(squareAdd(square, 1, 2));
      highlighted.push(squareAdd(square, 2, -1));
      highlighted.push(squareAdd(square, 2, 1));
      highlighted.push(squareAdd(square, -2, -1));
      highlighted.push(squareAdd(square, -2, 1));
    }
    if (piece[1] === "R") {
      for (const i of [1, 2, 3, 4, 5, 6, 7]) {
        highlighted.push(squareAdd(square, 0, i));
        highlighted.push(squareAdd(square, i, 0));
        highlighted.push(squareAdd(square, -i, 0));
        highlighted.push(squareAdd(square, 0, -i));
      }
    }
    this.setState({highlighted: highlighted, highlightedPiece: square});
    this.forceUpdate();
  }

  renderSquare(file, rank) {
    var square = "" + file + rank;
    var piece = this.state.pieces[square];
    var pieceRepr = reprPiece(piece);
    var highlighted = '';
    if (this.state.highlighted.includes(square)) {
      highlighted = 'highlighted';
    }
    console.log(this.state.highlightedPiece, square);
    if (this.state.highlightedPiece === square) {
      highlighted = 'highlighted-piece';
    }
    var onClick = (e) => this.highlightMoves(square, piece);
    return <td className={highlighted} title={square} key={square} onClick={onClick}>{pieceRepr}</td>;
  }

  renderRank(rank) {
    return <tr>{files.map(file => this.renderSquare(file, rank))}</tr>
  }

  renderBoard() {
    return (<table className="react-chess-game"><tbody>
      {ranks.map(rank => this.renderRank(rank))}
    </tbody></table>)
  }

  render() {
    return this.renderBoard();
  }
}

export default Chess;
