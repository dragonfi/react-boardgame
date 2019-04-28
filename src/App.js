import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Chess from './Chess.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Chess></Chess>
      </div>
    );
  }
}

export default App;
