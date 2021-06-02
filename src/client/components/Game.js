import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const {ShareGameModal} = require('./ShareGameModal.js');
const {GameOverModal} = require('./GameOverModal.js');

import {RemoteController} from '../controller/game/RemoteController';
import {LocalController} from '../controller/game/LocalController';

import {HumanPlayer} from '../controller/player/HumanPlayer';
import {RandomComputerPlayer} from '../controller/player/RandomComputerPlayer';
import {RemotePlayer} from '../controller/player/RemotePlayer';

import {teams} from "../../shared/model/teams";

export class Game extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const params = (new URL(document.location)).searchParams;
    const mode = params.get('mode');
    let gid = params.get('gid');
    let controller;
    if (mode === 'LOCAL') {
        controller = new LocalController(HumanPlayer, RandomComputerPlayer);
    } else if (mode === 'LOCALLOCAL') {
        controller = new LocalController(HumanPlayer, HumanPlayer);
    } else if (mode === 'REMOTEJOIN') {
        controller = new RemoteController(gid, teams.BLACK, RemotePlayer, HumanPlayer);
        controller.join();
    } else if (mode === 'REMOTECREATE') {
        controller = new RemoteController(gid, teams.WHITE, HumanPlayer, RemotePlayer);
        controller.create();

        // Needs to be in GameComponent
        $('#share-game-modal').modal();

    } else if (mode === 'AUTO') {
        controller = new LocalController(RandomComputerPlayer, RandomComputerPlayer);
    }
    window.addEventListener('resize', controller.view.onWindowResize.bind(controller.view));
  }
  render() {
    return (
        <div>
            <canvas id="game-canvas"> </canvas>
            <ShareGameModal />
            <GameOverModal />
        </div>
    );
  }
}
