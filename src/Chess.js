import React, { Component } from 'react';

import {files, ranks} from './ChessUtils.js'
import {pieceFromNotation} from './ChessPieces.js';

import './Chess.css';

const initialBoardState = {
  'a8': 'bR', 'b8': 'bN', 'c8': 'bB', 'd8': 'bQ', 'e8': 'bK', 'f8': 'bB', 'g8': 'bN', 'h8': 'bR',
  'a7': 'bP', 'b7': 'bP', 'c7': 'bP', 'd7': 'bP', 'e7': 'bP', 'f7': 'bP', 'g7': 'bP', 'h7': 'bP',

  'a1': 'wR', 'b1': 'wN', 'c1': 'wB', 'd1': 'wQ', 'e1': 'wK', 'f1': 'wB', 'g1': 'wN', 'h1': 'wR',
  'a2': 'wP', 'b2': 'wP', 'c2': 'wP', 'd2': 'wP', 'e2': 'wP', 'f2': 'wP', 'g2': 'wP', 'h2': 'wP',
};

function createInitialBoardState() {
  var board = {};
  for (const key in initialBoardState) {
    board[key] = pieceFromNotation(initialBoardState[key]);
  }
  return board;
}

class Chess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.pieces = createInitialBoardState();
    this.state.highlighted = [];
    this.state.highlightedSquare = '';
  }
  clearHighlights() {
    this.setState({highlightedSquare: '', highlighted: []});
  }
  highlightMoves(square, piece) {
    if (!piece) {
      this.setState({highlighted: [], highlightedSquare: ''});
      this.forceUpdate();
      return;
    }
    this.setState({
      highlighted: piece.type.validMoves(this, square, piece),
      highlightedSquare: square
    });
    this.forceUpdate();
  }

  movePiece(source, destination) {
    var pieces = this.state.pieces;
    var piece = pieces[source];
    console.log(source, destination, piece);
    pieces[destination] = piece;
    delete pieces[source];
    this.setState({pieces: pieces});
    this.clearHighlights();
    this.forceUpdate();
  }

  handleOnClick(square, piece) {
    console.log("onclick", square, piece);
    if (this.state.highlighted.includes(square)) {
      this.movePiece(this.state.highlightedSquare, square);
    } else {
      this.highlightMoves(square, piece);
    }
  }

  renderSquare(file, rank) {
    var square = "" + file + rank;
    var piece = this.state.pieces[square];
    var highlighted = '';
    if (this.state.highlighted.includes(square)) {
      highlighted = 'highlighted';
    }
    if (this.state.highlightedSquare === square) {
      highlighted = 'highlighted-piece';
    }
    var onClick = (e) => this.handleOnClick(square, piece);
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
