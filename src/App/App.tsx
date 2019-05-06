import React, { Component } from 'react';
import './App.css';

import {BoardGame} from '../BoardGame/BoardGame';
import {rules as chessRules} from '../Chess/ChessRules';

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
