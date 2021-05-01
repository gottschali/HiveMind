import {RemoteController} from './controller/game/RemoteController';
import {LocalController} from './controller/game/LocalController';

import {HumanPlayer} from './controller/player/HumanPlayer';
import {RandomComputerPlayer} from './controller/player/RandomComputerPlayer';
import {RemotePlayer} from './controller/player/RemotePlayer';

import {teams} from "../shared/model/teams";

// Headache: jQuery is included by layout.pug and is therefore already available
// If you reimport it, things break
// import $ from 'jquery';

$( () => {

    const container = document.getElementById('canvas-container');
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

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
        $('#share-game-modal').modal();
        const shareURL = new URL(window.location.origin + '/invite');
        shareURL.searchParams.append("gid", gid);
        shareURL.searchParams.append("mode", "REMOTEJOIN");
        const shareData = {
            title: 'HiveMind',
            text: "Let's play a game of online Hive, shall we?",
            url: shareURL.href
          }
        $('#share-game-button').on('click', async () => {
                if (navigator.canShare) {
                    await navigator.share(shareData).then( () => {
                        $('#feedback-region').html('Spread the word');
                    }).catch( (err) =>  {
                        $('#feedback-region').html('Error: ' + err);
                        console.error(err)
                    });
                } else {
                    $('#feedback-region').html('Your browser does not support native sharing. Please use the clipboard');
                }
        });
        $('#copy-game-button').on('click', async () => {
            navigator.clipboard.writeText(shareURL.href).then( () => {
                $('#feedback-region').html('Copied the link to the clipboard');
            }).catch( (err) => {
                $('#feedback-region').html('Error: ' + err);
            });
        });
    } else if (mode === 'AUTO') {
        controller = new LocalController(RandomComputerPlayer, RandomComputerPlayer, canvas);
    }
});


