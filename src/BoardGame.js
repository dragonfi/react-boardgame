import React, { Component } from 'react';

import {pieceFromNotation, Pawn, King, Queen, Rook, Knight, Bishop} from './ChessPieces.js';

import {rules as chessRules} from "./ChessRules.js"

import {rankRange, fileRange, Position} from "./ChessUtils.js"

 import './Chess.css';

class Board extends Component {
  // props: shape, pieces
  render() {
    const ranks = rankRange(this.props.shape.ranks);
    return (
      <table className="react-boardgame__board">
        <tbody>
          {ranks.map(rank => this._renderRank(rank))}
        </tbody>
      </table>
    );
  }

  _renderRank(rank) {
    const files = fileRange(this.props.shape.files);
    return (
      <tr key={rank}>
        {files.map(file => this._renderSquare(file, rank))}
      </tr>
    )
  }

  _renderSquare(file, rank) {
    const square = new Position("a1").setFile(file).setRank(rank);
    const piece = this.props.pieces[square];
    const figure = piece ? piece.figure : null;
    const color = piece ? piece.color : null;
    const isHighlighted = this.props.highlightedSquares.includes(square.toString());
    return <Square square={square.toString()} figure={figure} color={color} isHighlighted={isHighlighted} onClick={this.props.onSquareClick} />
  }
}

class Square extends Component {
  render() {
    const square = this.props.square;
    const isHighlighted = this.props.isHighlighted ? "react-boardgame__square--highlighted" : "";
    return (
      <td className={"react-boardgame__square " + isHighlighted} title={square} key={square} onClick={(_) => this.props.onClick(square)}>
        <div className={"react-boardgame__piece " + this.props.color}>{this.props.figure}</div>
      </td>
    )
  }
}

function mapValues(object, fn) {
  return Object.assign(
    {}, ...Object.keys(object).map(
      k => ({[k]: fn(object[k])})
    )
  );
}

class BoardGame extends Component {
  constructor(props) {
    const rules = props.rules;
    super(props);
    this.state = {
      board: rules.initialBoardState(),
      highlightedPiece: '',
      highlightedMoves: [],
    };
    // this.state.enPassant = [undefined, undefined];
    // this.state.kingMoved = [];
    // this.state.promotablePawn = null;
  }
  _pieceRepresentation(piece) {
    return {
      ...piece,
      figure: this.props.rules.pieces[piece.pieceType].figure,
    }
  }

  _highlightMoves(square) {
    const piece = this.state.board.pieces[square];
    if (!piece) {
      this.setState({highlightedMoves: [], highlightedPiece: ''});
      return;
    }
    this.setState({
      highlightedMoves: this.props.rules.pieces[piece.pieceType].validMoves(this.state.board, square),
      highlightedPiece: square,
    });
  }

  _movePiece(newSquare) {
    const square = this.state.highlightedPiece;
    const piece = this.state.board.pieces[square];
    const newBoard = this.props.rules.pieces[piece.pieceType].movePiece(this.state.board, square, newSquare);
    this.setState({
      board: newBoard,
      highlightedMoves: [],
      highlightedPiece: '',
    });
  }

  _onSquareClick(square) {
    if (this.state.highlightedMoves.includes(square)) {
      this._movePiece(square);
    } else {
      this._highlightMoves(square);
    }
  }

  render() {
    const boardRules = this.props.rules.board;
    const pieces = this.state.board.pieces;
    const pieceReprs = mapValues(pieces, (v) => this._pieceRepresentation(v));
    const highlightedSquares = [...this.state.highlightedMoves, this.state.highlightedPiece];
    return (
      <div className="react-boardgame">
        <Board shape={boardRules} pieces={pieceReprs} highlightedSquares={highlightedSquares} onSquareClick={this._onSquareClick.bind(this)}/>
      </div>
    )
  }
  /*
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
  */
}

// -------------------------------------------------------------
/*

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
    if (sourceRank === 7 && destinationRank === 5) {
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
        const rookSource = dest.setFile('h');
        const rookDest = dest.setFile('f');
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
*/
export {BoardGame};
