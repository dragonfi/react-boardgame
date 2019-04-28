import React, { Component } from 'react';

import {files, ranks, Position} from './ChessUtils.js'
import {pieceFromNotation, Pawn, King, Queen, Rook, Knight, Bishop} from './ChessPieces.js';

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

class PawnPromotionSelector extends Component {
  render() {
    const e = window.event;
    const left = e.clientX + "px";
    const top = e.clientY + "px";
    const style = {position: "absolute", top: top, left: left};
    return (
      <div className="react-chess-pawn-promotion-selector" style={style}>
        <div onClick={(e) => this.props.onClick(Queen)}><Queen color={this.props.color}/></div>
        <div onClick={(e) => this.props.onClick(Bishop)}><Bishop color={this.props.color}/></div>
        <div onClick={(e) => this.props.onClick(Knight)}><Knight color={this.props.color}/></div>
        <div onClick={(e) => this.props.onClick(Rook)}><Rook color={this.props.color}/></div>
      </div>
    )
  }
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
    this.state.promotablePawn = null;
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

  _calculateEnPassant(source, destination) {
    const sourceRank = new Position(source).rank;
    const destinationRank = new Position(destination).rank;
    if (sourceRank === 2 && destinationRank === 4) {
      return [new Position(destination).setRank(3).toString(), destination];
    }
    if (sourceRank === '7' && destinationRank === '5') {
      return [new Position(destination).setRank(6).toString(), destination];
    }
    return [undefined, undefined];
  }

  movePiece(source, destination) {
    var pieces = {...this.state.pieces};
    var piece = pieces[source];
    var enPassant = [undefined, undefined];
    var promotablePawn = null;
    if (piece.type === Pawn) {
      enPassant = this._calculateEnPassant(source, destination);
      if (destination === this.state.enPassant[0]) {
        delete pieces[this.state.enPassant[1]];
      }
    }
    if (piece.type === Pawn && [1, 8].includes(new Position(destination).rank)) {
      promotablePawn = destination;
    }
    var kingMoved = [...this.state.kingMoved];
    if (piece.type === King && !kingMoved.includes(piece.props.color)) {
      const dest = new Position(destination);
      if (dest.file === 'c') {
        const rookSource = dest.setFile('a');
        const rookDest = dest.setFile('d');
        pieces[rookDest] = pieces[rookSource];
        delete pieces[rookSource];
      }
      if (dest.file === 'g') {
        const rookSource = dest.setFile('f');
        const rookDest = dest.setFile('h');
        pieces[rookDest] = pieces[rookSource];
        delete pieces[rookSource];
      }
      kingMoved.push(piece.props.color);
    }
    pieces[destination] = piece;
    delete pieces[source];
    this.setState({pieces: pieces, enPassant: enPassant, kingMoved: kingMoved, promotablePawn: promotablePawn});

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

  promotePromotablePawn(pieceType) {
    const pawn = this.state.pieces[this.state.promotablePawn];

    let pieces = {...this.state.pieces};
    pieces[this.state.promotablePawn] = React.createElement(pieceType, {color: pawn.props.color});

    this.setState({pieces: pieces, promotablePawn: null});
  }

  renderPromotionSelector() {
    const pawn = this.state.pieces[this.state.promotablePawn];
    if (this.state.promotablePawn) {
      return <PawnPromotionSelector color={pawn.props.color} onClick={(pieceType) => this.promotePromotablePawn(pieceType)} />
    }
    return null;
  }

  renderBoard() {
    return (
      <div className="react-chess-game">
        <table className="react-chess-board">
          <tbody>
            {ranks.map(rank => this.renderRank(rank))}
          </tbody>
        </table>
        {this.renderPromotionSelector()}
    </div>)
  }

  render() {
    return this.renderBoard();
  }
}

export default Chess;
