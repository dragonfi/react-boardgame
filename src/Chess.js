import React, { Component } from 'react';

import './Chess.css';

const BLACK = "chess-color-black";
const WHITE = "chess-color-white";

class Piece extends Component {
  availableMoves(board) {
    throw TypeError("Not implemented");
  }
  render() {
    return <div className={"chess-piece " + this.props.color}>{this.props.figure}</div>
  }
}

class Rook extends Component {
  static validMoves(board, square) {
    var moves = [];
    for (const i of [1, 2, 3, 4, 5, 6, 7]) {
      moves.push(squareAdd(square, 0, i));
      moves.push(squareAdd(square, i, 0));
      moves.push(squareAdd(square, -i, 0));
      moves.push(squareAdd(square, 0, -i));
    }
    return moves;
  }
  render() {
    return <Piece figure="♜" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class Bishop extends Component {
  static validMoves(board, square) {
    var moves = [];
    for (const i of [1, 2, 3, 4, 5, 6, 7]) {
      moves.push(squareAdd(square, i, i));
      moves.push(squareAdd(square, -i, i));
      moves.push(squareAdd(square, i, -i));
      moves.push(squareAdd(square, -i, -i));
    }
    return moves;
  }
  render() {
    return <Piece figure="♝" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class Knight extends Component {
  static validMoves(board, square) {
    var moves = [];
    moves.push(squareAdd(square, -1, -2));
    moves.push(squareAdd(square, -1, 2));
    moves.push(squareAdd(square, 1, -2));
    moves.push(squareAdd(square, 1, 2));
    moves.push(squareAdd(square, 2, -1));
    moves.push(squareAdd(square, 2, 1));
    moves.push(squareAdd(square, -2, -1));
    moves.push(squareAdd(square, -2, 1));
    return moves;
  }
  render() {
    return <Piece figure="♞" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class Pawn extends Component {
  static validMoves(board, square, piece) {
    var moves = [];
    if (piece.props.color === WHITE) {
      moves.push(squareAdd(square, 0, 1));
    } else {
      moves.push(squareAdd(square, 0, -1));
    }
    return moves;
  }
  render() {
    return <Piece figure="♟" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class King extends Component {
  static validMoves(board, square) {
    var moves = [];
    moves.push(squareAdd(square, 1, 1));
    moves.push(squareAdd(square, 0, 1));
    moves.push(squareAdd(square, -1, 1));
    moves.push(squareAdd(square, 1, 0));
    moves.push(squareAdd(square, -1, 0));
    moves.push(squareAdd(square, 1, -1));
    moves.push(squareAdd(square, 0, -1));
    moves.push(squareAdd(square, -1, -1));
    return moves;
  }
  render() {
    return <Piece figure="♚" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class Queen extends Component {
  static validMoves(board, square) {
    var moves = [];
    for (const i of [1, 2, 3, 4, 5, 6, 7]) {
      moves.push(squareAdd(square, i, i));
      moves.push(squareAdd(square, 0, i));
      moves.push(squareAdd(square, -i, i));
      moves.push(squareAdd(square, i, 0));
      moves.push(squareAdd(square, -i, 0));
      moves.push(squareAdd(square, i, -i));
      moves.push(squareAdd(square, 0, -i));
      moves.push(squareAdd(square, -i, -i));
    }
    return moves;
  }
  render() {
    return <Piece figure="♛" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

function reprPiece(code) {
  const reprs = {
    'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
    'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
  }
  return reprs[code];
}

const initialBoardState = {
  'a8': 'bR', 'b8': 'bN', 'c8': 'bB', 'd8': 'bQ', 'e8': 'bK', 'f8': 'bB', 'g8': 'bN', 'h8': 'bR',
  'a7': 'bP', 'b7': 'bP', 'c7': 'bP', 'd7': 'bP', 'e7': 'bP', 'f7': 'bP', 'g7': 'bP', 'h7': 'bP',

  'a1': 'wR', 'b1': 'wN', 'c1': 'wB', 'd1': 'wQ', 'e1': 'wK', 'f1': 'wB', 'g1': 'wN', 'h1': 'wR',
  'a2': 'wP', 'b2': 'wP', 'c2': 'wP', 'd2': 'wP', 'e2': 'wP', 'f2': 'wP', 'g2': 'wP', 'h2': 'wP',
};

function notationToPiece(code) {
  console.log(code);
  if (!code) {
    return;
  }
  var color = code[0] === 'w' ? WHITE : BLACK;
  console.log(color);
  var pieceClass = {'K': King, 'Q': Queen, 'B': Bishop, 'N': Knight, 'R': Rook, 'P': Pawn};
  return React.createElement(pieceClass[code[1]], {color: color});
}

function createInitialBoardState() {
  var board = {};
  for (const key in initialBoardState) {
    board[key] = notationToPiece(initialBoardState[key]);
  }
  return board;
}

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
    this.state.pieces = createInitialBoardState();
    this.state.highlighted = [];
    this.state.highlightedPiece = '';
  }
  highlightMoves(square, piece) {
    console.log("hl:", piece);
    if (!piece) {
      this.setState({highlighted: [], highlightedPiece: ''});
      this.forceUpdate();
      return;
    }
    this.setState({
      highlighted: piece.type.validMoves(this, square, piece),
      highlightedPiece: square
    });
    this.forceUpdate();
  }

  renderSquare(file, rank) {
    var square = "" + file + rank;
    var piece = this.state.pieces[square];
    var highlighted = '';
    if (this.state.highlighted.includes(square)) {
      highlighted = 'highlighted';
    }
    if (this.state.highlightedPiece === square) {
      highlighted = 'highlighted-piece';
    }
    var onClick = (e) => this.highlightMoves(square, piece);
    return <td className={highlighted} title={square} key={square} onClick={onClick}>{piece}</td>;
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
