import React, { Component } from 'react';

import {squareAdd} from './ChessUtils.js';

const BLACK = "chess-color-black";
const WHITE = "chess-color-white";
const NOCOLOR = undefined;


function opposingColor(color) {
  switch (color) {
    case WHITE: return BLACK;
    case BLACK: return WHITE;
    default: return NOCOLOR;
  }
}

function squareColor(board, square) {
  const piece = board.state.pieces[square];
  return piece ? piece.props.color : NOCOLOR;
}

function hasFriendlyPiece(board, square, color) {
  return squareColor(board, square) === color;
}

function hasOpposingPiece(board, square, color) {
  return squareColor(board, square) === opposingColor(color);
}

function isEmptySquare(board, square) {
  return squareColor(board, square) === NOCOLOR;
}

class Piece extends Component {
  static availableMoves(board, square, piece) {
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
  static validMoves(board, square, piece) {
    var moves = [];
    for (const delta of [[-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1], [-2, -1], [-2, 1]]) {
      let newSquare = squareAdd(square, delta[0], delta[1]);
      if (!hasFriendlyPiece(board, newSquare, piece.props.color)) {
        moves.push(newSquare);
      }
    }
    return moves;
  }

  render() {
    return <Piece figure="♞" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class Pawn extends Component {
  static validMoves(board, square, piece) {
    var moves = [];
    var direction = piece.props.color === WHITE ? 1 : -1;

    let newSquare = squareAdd(square, 0, direction);
    if (isEmptySquare(board, newSquare)) {
      moves.push(newSquare);
    }
    if ('27'.includes(square[1])) {
      let newSquare = squareAdd(square, 0, direction*2);
      if (isEmptySquare(board, newSquare)) {
        moves.push(newSquare);
      }
    }
    for (const drank of [-1, 1]) {
      let newSquare = squareAdd(square, drank, direction);
      if (hasOpposingPiece(board, newSquare, piece.props.color)) {
        moves.push(newSquare);
      }
    }
    return moves;
  }

  render() {
    return <Piece figure="♟" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class King extends Component {
  static validMoves(board, square, piece) {
    var moves = [];
    for (const delta of [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [0, -1], [-1, -1]]) {
      let newSquare = squareAdd(square, delta[0], delta[1]);
      if (!hasFriendlyPiece(board, newSquare, piece.props.color)) {
        moves.push(newSquare);
      }
    }
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

export function pieceFromNotation(code) {
  if (!code || code.length < 2) {
    return;
  }
  var color = code[0] === 'w' ? WHITE : BLACK;
  var pieceClass = {'K': King, 'Q': Queen, 'B': Bishop, 'N': Knight, 'R': Rook, 'P': Pawn};
  return React.createElement(pieceClass[code[1]], {color: color});
}
