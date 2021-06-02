import {RemoteController} from './controller/game/RemoteController';
import {LocalController} from './controller/game/LocalController';

import {HumanPlayer} from './controller/player/HumanPlayer';
import {RandomComputerPlayer} from './controller/player/RandomComputerPlayer';
import {RemotePlayer} from './controller/player/RemotePlayer';

import {teams} from "../shared/model/teams";

import 'bootstrap/dist/css/bootstrap.min.css';


// Headache: jQuery is included by layout.pug and is therefore already available
// If you reimport it, things break
// import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
const {ShareGameModal} = require('./components/ShareGameModal.js');


$( () => {

    const container = document.getElementById('canvas-container');
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const exampleElement = <ShareGameModal />;
    ReactDOM.render(exampleElement, document.getElementById('share-game-modal-container'));


    const params = (new URL(document.location)).searchParams;
    const mode = params.get('mode');
    let gid = params.get('gid');
    let controller;
    if (mode === 'LOCAL') {
        controller = new LocalController(HumanPlayer, RandomComputerPlayer, canvas);
    } else if (mode === 'LOCALLOCAL') {
        controller = new LocalController(HumanPlayer, HumanPlayer, canvas);
    } else if (mode === 'REMOTEJOIN') {
        controller = new RemoteController(gid, teams.BLACK, RemotePlayer, HumanPlayer, canvas);
        controller.join();
    } else if (mode === 'REMOTECREATE') {
        controller = new RemoteController(gid, teams.WHITE, HumanPlayer, RemotePlayer, canvas);
        controller.create();

        // Needs to be in GameComponent
        $('#share-game-modal').modal();

    } else if (mode === 'AUTO') {
        controller = new LocalController(RandomComputerPlayer, RandomComputerPlayer, canvas);
    }
    window.addEventListener('resize', controller.view.onWindowResize.bind(controller.view));
});


