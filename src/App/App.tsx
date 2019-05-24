import React, { Component } from 'react';
import './App.css';

import {ErrorBoundary} from '../Utils/ErrorBoundary';
import {BoardGame, BoardGameRules} from '../BoardGame/BoardGame';
import {rules as chessRules} from '../Chess/ChessRules';
import {rules as checkersRules} from '../Checkers/CheckersRules';
import {rules as goRules} from '../Go/GoRules';
import {rules as shogiRules} from '../Shogi/ShogiRules';

import {Selector} from '../Selector/Selector';

import {ObjectMap} from '../Utils/ObjectMap';

class GameSelector extends Selector<BoardGameRules<any>> {
  render() {
    return (
      <div>
        {super.render()}
      </div>
    )
  }
};

class App extends Component<{}, {gameRules: BoardGameRules<any>}> {
  selectorOptions: ObjectMap<BoardGameRules<any>> = {
    "Chess": chessRules,
    "Checkers": checkersRules,
    "Go": goRules,
    "Shogi": shogiRules,
  }

  constructor(props: {}) {
    super(props);
    this.state = {gameRules: this.selectorOptions.Chess};
  }

  _onGameSelect(rules: BoardGameRules<any>) {
    this.setState({
      gameRules: rules,
    });
    console.log(rules);
  }

  render() {
    return (
      <div className="App react-boardgame__main-container">
        <GameSelector options={this.selectorOptions} onSelect={this._onGameSelect.bind(this)} />
        <div key={this.state.gameRules.initialBoardState.toString()} className="react-boardgame__inline-container">
          <ErrorBoundary errorMessage="An error occured, we misplayed the board. Care to play a different game?">
            <BoardGame rules={this.state.gameRules} />
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

export default App;
