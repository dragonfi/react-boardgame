import React from 'react';

import {BoardGameRules, BoardState, PieceState, SideIndicator} from '../BoardGame/BoardGame';
import {Position} from '../BoardGameUtils/Position';
import {ObjectMap} from '../Utils/ObjectMap';

import './Shogi.css';

export {rules};

const WHITE = "react-boardgame__piece--color-white";
const BLACK = "react-boardgame__piece--color-black";
const NOCOLOR = "react-boardgame__piece--color-nocolor";

function opposingColor(color: string): string {
  switch (color) {
    case WHITE: return BLACK;
    case BLACK: return WHITE;
    default: return NOCOLOR;
  }
}

function squareColor(board: BoardState, square: string): string {
  const piece = board.pieces[square];
  return piece ? piece.color : NOCOLOR;
}

function hasOpposingPiece(board: BoardState, square: string, color: string): boolean {
  return squareColor(board, square) === opposingColor(color);
}

function hasFriendlyPiece(board: BoardState, square: string, color: string): boolean {
  return squareColor(board, square) === color;
}


const KING = "王";
const GOLD = "金";
const SILVER = "銀";
const KNIGHT = "桂";
const LANCE = "香";
const BISHOP = "角";
const ROOK = "飛";
const PAWN = "歩";

const DRAGON = "竜";
const HORSE = "馬";
const PROMOTED_SILVER = "全";
const PROMOTED_KNIGHT = "今";
const PROMOTED_LANCE = "仝";
const TOKIN = "と";


interface ShogiBoardState extends BoardState {
  hand: ObjectMap<Array<PieceState>>;
  promotablePiece: string | null;
  pieceToDrop: PieceState | null;
}

class PieceRules {
  static figure = " ";
  static promotedVersion: string | null = null;

  static movePiece(board: ShogiBoardState, square: string, newSquare: string): ShogiBoardState {
    let pieces = {...board.pieces};
    let hand = {...board.hand};
    let promotablePiece = null;

    const piece = board.pieces[square];

    const removedPiece = board.pieces[newSquare];
    if (removedPiece) {
      hand[piece.color] = [...hand[piece.color], {pieceType: removedPiece.pieceType, color: piece.color}];
    }

    delete pieces[square];
    pieces[newSquare] = piece;

    if (this.promotedVersion && (this._inPromotionZone(square, piece.color) || this._inPromotionZone(newSquare, piece.color))) {
      promotablePiece = newSquare;
    }

    return {...board, pieces: pieces, hand: hand, promotablePiece: promotablePiece, activeSide: opposingColor(board.activeSide)};
  }
  static _inPromotionZone(square: string, color: string): boolean {
    const _square = new Position(square);
    return color === BLACK ? _square.rank > 6 : _square.rank < 4;
  }
}

class EnumeratedMovePieceRules extends PieceRules {
  static moves: Array<Array<number>> = [[0, 0]];
  static validMoves(board: ShogiBoardState, square: string): Array<string> {
    const piece = board.pieces[square];

    const validMoves = [];
    const _moves = piece.color === BLACK ? this.moves : this._flipSingleMoves();
    for (const [dFile, dRank] of _moves) {
      const newSquare = new Position(square).offsetFile(dFile).offsetRank(dRank).toString();
      if (!hasFriendlyPiece(board, newSquare, piece.color)) {
        validMoves.push(newSquare);
      }
    }
    return validMoves;
  }
  static _flipSingleMoves(): Array<Array<number>> {
    return this.moves.map((pair) => [pair[0], pair[1] * -1]);
  }
}

class RangingPieceRules extends PieceRules {
  static directions: Array<Array<number>> = [[0, 0]];
  static validMoves(board: ShogiBoardState, square: string): Array<string> {
    const piece = board.pieces[square];

    const validMoves = [];
    const _directions = piece.color === BLACK ? this.directions : this._flipDirections();
    for (const [dFile, dRank] of _directions) {
      for(let i = 1; i < 9; i++) {
        const newSquare = new Position(square).offsetFile(dFile*i).offsetRank(dRank*i).toString();
        if (hasFriendlyPiece(board, newSquare, piece.color)) {
          break;
        }
        validMoves.push(newSquare);
        if (hasOpposingPiece(board, newSquare, piece.color)) {
          break;
        }
      }
    }
    return validMoves;
  }

  static _flipDirections(): Array<Array<number>> {
    return this.directions.map((pair) => [pair[0], pair[1] * -1]);
  }
}

class KingRules extends EnumeratedMovePieceRules {
  static figure = "王";
  static moves = [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [0, -1], [-1, -1]];
}

class GoldRules extends EnumeratedMovePieceRules {
  static figure = "金";
  static moves = [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [0, -1]];
}

class SilverRules extends EnumeratedMovePieceRules {
  static figure = "銀";
  static moves = [[1, 1], [0, 1], [-1, 1], [1, -1], [-1, -1]];
  static promotedVersion = PROMOTED_SILVER;
}

class KnightRules extends EnumeratedMovePieceRules {
  static figure = "桂";
  static moves = [[1, 2], [-1, 2]];
  static promotedVersion = PROMOTED_KNIGHT;
}

class PawnRules extends EnumeratedMovePieceRules {
  static figure = "歩";
  static moves = [[0, 1]];
  static promotedVersion = TOKIN;
}

class LanceRules extends RangingPieceRules {
  static figure = "香";
  static directions = [[0, 1]];
  static promotedVersion = PROMOTED_LANCE;
}

class BishopRules extends RangingPieceRules {
  static figure = "角";
  static directions = [[-1, 1], [1, 1], [-1, -1], [1, -1]];
  static promotedVersion: string | null = HORSE;
}

class RookRules extends RangingPieceRules {
  static figure = "飛";
  static directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];
  static promotedVersion: string | null = DRAGON;
}

class HorseRules extends BishopRules {
  static figure = "馬";
  static promotedVersion = null;
  static enumeratedMoves = EnumeratedMovePieceRules.validMoves.bind(KingRules);
  static validMoves(board: ShogiBoardState, square: string): Array<string> {
    return super.validMoves(board, square).concat(this.enumeratedMoves(board, square));
  }
}

class DragonRules extends RookRules {
  static figure = "竜";
  static promotedVersion = null;
  static enumeratedMoves = EnumeratedMovePieceRules.validMoves.bind(KingRules);
  static validMoves(board: ShogiBoardState, square: string): Array<string> {
    return super.validMoves(board, square).concat(this.enumeratedMoves(board, square));
  }
}

class PromotedSilverRules extends GoldRules {
  static figure = "全";
}

class PromotedKnightRules extends GoldRules {
  static figure = "今";
}

class PromotedLanceRules extends GoldRules {
  static figure = "仝";
}

class TokinRules extends GoldRules {
  static figure = "と"
}

class PiecePromotionSelector {
  static condition(board: ShogiBoardState): boolean {
    return !!board.promotablePiece;
  }
  static options(board: ShogiBoardState): Array<PieceState> {
    if (!board.promotablePiece) {
      return [];
    }
    const piece = board.pieces[board.promotablePiece];
    const color = piece.color;
    const pieceRules: any /* PieceRules */ = rules.pieces[piece.pieceType];
    if (!pieceRules.promotedVersion) {
      return [];
    }
    return [{pieceType: pieceRules.promotedVersion, color: color}];
  }
  static handleResult(board: ShogiBoardState, result: PieceState): ShogiBoardState {
    const pieces = board.promotablePiece ? {...board.pieces, [board.promotablePiece]: result}: {...board.pieces};
    return {...board, pieces: pieces, promotablePiece: null};
  }
}

function initialBoardState(): ShogiBoardState {

  return {
    pieces: {
      "e1": {pieceType: KING, color: BLACK},
      "d1": {pieceType: GOLD, color: BLACK},
      "f1": {pieceType: GOLD, color: BLACK},
      "c1": {pieceType: SILVER, color: BLACK},
      "g1": {pieceType: SILVER, color: BLACK},
      "b1": {pieceType: KNIGHT, color: BLACK},
      "h1": {pieceType: KNIGHT, color: BLACK},
      "a1": {pieceType: LANCE, color: BLACK},
      "i1": {pieceType: LANCE, color: BLACK},

      "b2": {pieceType: BISHOP, color: BLACK},
      "h2": {pieceType: ROOK, color: BLACK},

      "a3": {pieceType: PAWN, color: BLACK},
      "b3": {pieceType: PAWN, color: BLACK},
      "c3": {pieceType: PAWN, color: BLACK},
      "d3": {pieceType: PAWN, color: BLACK},
      "e3": {pieceType: PAWN, color: BLACK},
      "f3": {pieceType: PAWN, color: BLACK},
      "g3": {pieceType: PAWN, color: BLACK},
      "h3": {pieceType: PAWN, color: BLACK},
      "i3": {pieceType: PAWN, color: BLACK},

      "a7": {pieceType: PAWN, color: WHITE},
      "b7": {pieceType: PAWN, color: WHITE},
      "c7": {pieceType: PAWN, color: WHITE},
      "d7": {pieceType: PAWN, color: WHITE},
      "e7": {pieceType: PAWN, color: WHITE},
      "f7": {pieceType: PAWN, color: WHITE},
      "g7": {pieceType: PAWN, color: WHITE},
      "h7": {pieceType: PAWN, color: WHITE},
      "i7": {pieceType: PAWN, color: WHITE},

      "b8": {pieceType: ROOK, color: WHITE},
      "h8": {pieceType: BISHOP, color: WHITE},

      "e9": {pieceType: KING, color: WHITE},
      "d9": {pieceType: GOLD, color: WHITE},
      "f9": {pieceType: GOLD, color: WHITE},
      "c9": {pieceType: SILVER, color: WHITE},
      "g9": {pieceType: SILVER, color: WHITE},
      "b9": {pieceType: KNIGHT, color: WHITE},
      "h9": {pieceType: KNIGHT, color: WHITE},
      "a9": {pieceType: LANCE, color: WHITE},
      "i9": {pieceType: LANCE, color: WHITE},
    },
    activeSide: BLACK,
    hand: {
      [WHITE]: [],
      [BLACK]: [],
    },
    promotablePiece: null,
    pieceToDrop: null,
  }
}

import {Piece} from '../BoardGame/Piece';

interface HandIndicatorProps {
  title: string;
  pieces: Array<PieceState>;
  onPieceClick: (piece: PieceState) => void;
}

class HandIndicator extends React.Component<HandIndicatorProps, {highlighted: number | null}> {
  constructor(props: HandIndicatorProps) {
    super(props);
    this.state = {highlighted: null};
  }
  render() {
    return (<div>
      <h4>{this.props.title}</h4>
      <div>
        {this._renderPieces(this.props.pieces)}
      </div>
    </div>);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this._handleDocumentClick.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleDocumentClick.bind(this));
  }

  _handleDocumentClick(_: MouseEvent) {
    this.setState({highlighted: null});
  }

  _renderPieces(pieces: Array<PieceState>) {
    return pieces.map((piece, index) => this._renderPiece(piece, index));
  }
  _renderPiece(piece: PieceState, key: number) {
    const figure = rules.pieces[piece.pieceType].figure;
    const className = "react-boardgame__hand-indicator__piece--shogi" + (key === this.state.highlighted ? "--highlighted": "");
    return (<div className={className} key={key} onClick={() => {this.props.onPieceClick(piece); this.setState({highlighted: key})}}>
      <Piece figure={figure} color={piece.color} />
    </div>)
  }
}

class HandIndicators extends SideIndicator<ShogiBoardState> {
  render() {
    return (
      <div className="react-boardgame__hand-indicator--shogi">
        <p>Active side: <Piece figure=" " color={this.props.board.activeSide} /></p>
        <HandIndicator title="Hand of White:" pieces={this.props.board.hand[WHITE]} onPieceClick={this.props.onPieceClick}/>
        <HandIndicator title="Hand of Black:" pieces={this.props.board.hand[BLACK]} onPieceClick={this.props.onPieceClick}/>
      </div>
    )
  }
  static handleOnClick(board: ShogiBoardState, piece: PieceState): ShogiBoardState {
    return {... board, pieceToDrop: piece};
  }
}

function samePiece(first: PieceState, other: PieceState) {
  return first.color === other.color && first.pieceType === other.pieceType;
}

interface Callable1<A, R> {
  (a: A): R;
}

function removeOne<T>(ts: Array<T>, predicate: Callable1<T, boolean>): Array<T> {
  const matching = ts.filter(predicate);
  const rest = ts.filter((item) => !predicate(item));
  return rest.concat(matching.slice(0, matching.length -1));
}

function emptySquareMove(board: ShogiBoardState, square: string): ShogiBoardState {
  if (!board.pieceToDrop) {
    return {...board};
  }
  const piece: PieceState = board.pieceToDrop;
  const color = board.pieceToDrop.color;
  const activeHand = removeOne<PieceState>(board.hand[color], samePiece.bind(null, piece));
  return {
    ...board,
    pieces: {...board.pieces, [square]: board.pieceToDrop},
    hand: {
      ...board.hand,
      [board.pieceToDrop.color]: activeHand,
    },
    pieceToDrop: null
  };
}

const rules: BoardGameRules<ShogiBoardState> = {
  board: {ranks: 9, files: 9, style: 'shogi'},
  pieces: {
    [KING]: KingRules,
    [GOLD]: GoldRules,
    [SILVER]: SilverRules,
    [KNIGHT]: KnightRules,
    [LANCE]: LanceRules,
    [BISHOP]: BishopRules,
    [ROOK]: RookRules,
    [PAWN]: PawnRules,
    [DRAGON]: DragonRules,
    [HORSE]: HorseRules,
    [PROMOTED_SILVER]: PromotedSilverRules,
    [PROMOTED_KNIGHT]: PromotedKnightRules,
    [PROMOTED_LANCE]: PromotedLanceRules,
    [TOKIN]: TokinRules,
  },
  initialBoardState: initialBoardState,
  selectors: [PiecePromotionSelector],
  sideIndicators: [HandIndicators],
  emptySquareMove: emptySquareMove,
}
