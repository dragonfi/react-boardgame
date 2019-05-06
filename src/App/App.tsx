import React, { Component } from 'react';
import './App.css';

import {ErrorBoundary} from '../Utils/ErrorBoundary';
import {BoardGame} from '../BoardGame/BoardGame';
import {rules as chessRules} from '../Chess/ChessRules';
import {rules as checkersRules} from '../Checkers/CheckersRules';

class App extends Component {
  render() {
    return (
      <div className="App react-boardgame__main-container">
        <div className="react-boardgame__inline-container">
          <ErrorBoundary errorMessage="An error occured, we misplayed the checkers board. Care to play a different game?">
            <BoardGame rules={checkersRules}></BoardGame>
          </ErrorBoundary>
        </div>
        <div className="react-boardgame__inline-container">
          <ErrorBoundary errorMessage="An error occured, we misplayed the chess board. Care to play a different game?">
            <BoardGame rules={chessRules}></BoardGame>
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

export default App;
