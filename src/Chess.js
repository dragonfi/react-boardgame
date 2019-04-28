import React, { Component } from 'react';

import {files, ranks} from './ChessUtils.js'
import {pieceFromNotation, Pawn, King} from './ChessPieces.js';

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
    this.state.enPassant = [undefined, undefined];
    this.state.kingMoved = [];
  }

  clearHighlights() {
    this.setState({highlightedSquare: '', highlighted: []});
  }

  highlightMoves(square, piece) {
    if (!piece) {
      this.setState({highlighted: [], highlightedSquare: ''});
      return;
    }
    this.setState({
      highlighted: piece.type.validMoves(this, square, piece),
      highlightedSquare: square
    });
  }

  movePiece(source, destination) {
    var pieces = {...this.state.pieces};
    var piece = pieces[source];
    var enPassant = [undefined, undefined];
    if (piece.type === Pawn) {
      const sRow = source[1];
      const dRow = destination[1];
      if (sRow === '2' && dRow === '4') {
        enPassant = [destination[0] + '3', destination];
      }
      if (sRow === '7' && dRow === '5') {
        enPassant = [destination[0] + '6', destination];
      }

      if (destination === this.state.enPassant[0]) {
        delete pieces[this.state.enPassant[1]];
      }
    }
    var kingMoved = [...this.state.kingMoved];
    if (piece.type === King && !kingMoved.includes(piece.props.color)) {
      if (destination === 'c1') {
        pieces['d1'] = pieces['a1'];
        delete pieces['a1'];
      }
      if (destination === 'g1') {
        pieces['f1'] = pieces['h1'];
        delete pieces['h1'];
      }
      if (destination === 'c8') {
        pieces['d8'] = pieces['a8'];
        delete pieces['a8'];
      }
      if (destination === 'g8') {
        pieces['f8'] = pieces['h8'];
        delete pieces['h8'];
      }
      kingMoved.push(piece.props.color);
    }
    pieces[destination] = piece;
    delete pieces[source];
    this.setState({pieces: pieces, enPassant: enPassant, kingMoved: kingMoved});

    this.clearHighlights();
  }

  handleOnClick(square, piece) {
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
    return <tr key={rank}>{files.map(file => this.renderSquare(file, rank))}</tr>
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
