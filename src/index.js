import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header.js';
import Board from './components/Board.js';
import Game from './components/Game.js';

const App = () => (
    <React.Fragment>
        <Header />
        <Game />
    </React.Fragment>
);

ReactDOM.render(<App />, document.getElementById("root"));
