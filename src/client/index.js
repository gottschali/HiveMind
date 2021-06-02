import 'bootstrap/dist/css/bootstrap.min.css';

// Headache: jQuery is included by layout.pug and is therefore already available
// If you reimport it, things break
// import $ from 'jquery';

import React from 'react';
import ReactDOM from 'react-dom';
const {ShareGameModal} = require('./components/ShareGameModal.js');
const {Game} = require('./components/Game.js');


$( () => {
    const exampleElement = <Game />;
    ReactDOM.render(exampleElement, document.getElementById('canvas-container'));

});
