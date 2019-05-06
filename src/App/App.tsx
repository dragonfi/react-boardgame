import React, { Component } from 'react';
import './App.css';

import {BoardGame} from '../BoardGame/BoardGame';
import {rules as chessRules} from '../Chess/ChessRules';
import {rules as checkersRules} from '../Checkers/CheckersRules';

class App extends Component {
  render() {
    return (
      <div className="App react-boardgame__main-container">
      <div className="react-boardgame__inline-container">
        <BoardGame rules={checkersRules}></BoardGame>
      </div>
        <div className="react-boardgame__inline-container">
          <BoardGame rules={chessRules}></BoardGame>
        </div>

      </div>
    );
  }
}

export default App;
