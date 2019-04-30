import React, { Component } from 'react';
import './App.css';

import {BoardGame} from './BoardGame.js';
import {rules as chessRules} from './ChessRules';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BoardGame rules={chessRules}></BoardGame>
      </div>
    );
  }
}

export default App;
