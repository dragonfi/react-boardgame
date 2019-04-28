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

function projectedMove(board, square, direction, color) {
  var moves = [];
  for(const i of [1, 2, 3, 4, 5, 6, 7]) {
    let dfile = direction[0] * i;
    let drank = direction[1] * i;
    let newSquare = squareAdd(square, dfile, drank);
    if (hasFriendlyPiece(board, newSquare, color)) {
      break;
    }
    moves.push(newSquare);
    if (hasOpposingPiece(board, newSquare, color)) {
      break;
    }
  }
  return moves;
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
  static validMoves(board, square, piece) {
    var moves = [];
    for (const direction of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      moves = moves.concat(projectedMove(board, square, direction, piece.props.color));
    }
    return moves;
  }

  render() {
    return <Piece figure="♜" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class Bishop extends Component {
  static validMoves(board, square, piece) {
    var moves = [];
    for (const direction of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      moves = moves.concat(projectedMove(board, square, direction, piece.props.color));
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
      if ('27'.includes(square[1])) {
        let newSquare = squareAdd(square, 0, direction*2);
        if (isEmptySquare(board, newSquare)) {
          moves.push(newSquare);
        }
      }
    }

    for (const drank of [-1, 1]) {
      let newSquare = squareAdd(square, drank, direction);
      if (hasOpposingPiece(board, newSquare, piece.props.color)) {
        moves.push(newSquare);
      }
      if (newSquare === board.state.enPassant[0]) {
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
    if (!board.state.kingMoved.includes(piece.props.color)) {
      const rank = square[1];
      let rookSquare = 'a' + rank;
      let emptySquares = ['b' + rank, 'c' + rank, 'd' + rank];
      let hasFriendlyRook = hasFriendlyPiece(board, rookSquare, piece.props.color) && board.state.pieces[rookSquare].type === Rook;
      if (hasFriendlyRook && emptySquares.every((square) => isEmptySquare(board, square))) {
        moves.push(emptySquares[1]);
      }
      rookSquare = 'h' + rank;
      emptySquares = ['f' + rank, 'g' + rank];
      hasFriendlyRook = hasFriendlyPiece(board, rookSquare, piece.props.color) && board.state.pieces[rookSquare].type === Rook;
      if (hasFriendlyRook && emptySquares.every((square) => isEmptySquare(board, square))) {
        moves.push(emptySquares[1]);
      }
    }
    return moves;
  }

  render() {
    return <Piece figure="♚" color={this.props.color} validMoves={this.validMoves}></Piece>
  }
}

class Queen extends Component {
  static validMoves(board, square, piece) {
    var moves = [];
    for (const direction of [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]]) {
      moves = moves.concat(projectedMove(board, square, direction, piece.props.color));
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

function pieceFromNotation(code) {
  if (!code || code.length < 2) {
    return;
  }
  var color = code[0] === 'w' ? WHITE : BLACK;
  var pieceClass = {'K': King, 'Q': Queen, 'B': Bishop, 'N': Knight, 'R': Rook, 'P': Pawn};
  return React.createElement(pieceClass[code[1]], {color: color});
}

export {pieceFromNotation, Pawn, King};
