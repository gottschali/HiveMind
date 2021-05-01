import {RemoteController} from './controller/game/RemoteController';
import {LocalController} from './controller/game/LocalController';

import {HumanPlayer} from './controller/player/HumanPlayer';
import {RandomComputerPlayer} from './controller/player/RandomComputerPlayer';
import {RemotePlayer} from './controller/player/RemotePlayer';

import $ from 'jquery';

const container = document.getElementById('canvas-container');
console.log(container);
const canvas = document.createElement('canvas');
container.appendChild(canvas);

$( () => {
    const params = (new URL(document.location)).searchParams;
    const mode = params.get('mode');
    const gid = params.get('gid');
    let c1, c2, controller;
    if (mode === 'LOCAL') {
        controller = new LocalController(HumanPlayer, RandomComputerPlayer, canvas);
    } else if (mode === 'LOCALLOCAL') {
        controller = new LocalController(HumanPlayer, HumanPlayer, canvas);
    } else if (mode === 'REMOTEJOIN') {
        controller = new RemoteController(gid, RemotePlayer, HumanPlayer, canvas);
        controller.join();
    } else if (mode === 'REMOTECREATE') {
        controller = new RemoteController(gid, HumanPlayer, RemotePlayer, canvas);
        controller.create();
    } else if (mode === 'AUTO') {
        controller = new LocalController(RandomComputerPlayer, RandomComputerPlayer, canvas);
    }
});

