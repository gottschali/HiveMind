import {RemoteController} from './controller/game/RemoteController';
import {LocalController} from './controller/game/LocalController';

import {HumanPlayer} from './controller/player/HumanPlayer';
import {RandomComputerPlayer} from './controller/player/RandomComputerPlayer';
import {RemotePlayer} from './controller/player/RemotePlayer';

import {teams} from "../shared/model/teams";

// Headache: jQuery is included by layout.pug and is therefore already available
// If you reimport it, things break
// import $ from 'jquery';
function ShareGameModal(props) {
    return (
        <div>
            <button className="btn btn-primary" type="button" data-toggle="modal" data-target="#share-game-modal">
                Invite
            </button>
            <div className="modal fade" id="share-game-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Share the link to this game</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close"> </button>
                                <span aria-hidden="true">×</span>
                        </div>
                        <div className="modal-body">
                                <button className="btn btn-secondary" id="copy-game-button" type="button">
                                    <svg className="bi bi-clipboard" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"> </path><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path></svg>
                                </button>
                                <br/>
                                <button className="btn btn-primary" id="share-game-button" type="button"><svg className="bi bi-share" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
                                    </svg>
                                    Invite a friend to play
                                </button>
                                <br/>

                            <div className="bg-warning rounded-pill" id="feedback-region"> </div>
                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

$( () => {

    const container = document.getElementById('canvas-container');
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ReactDOM = require('react-dom');
    const exampleElement = <ShareGameModal />
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
    window.addEventListener('resize', controller.view.onWindowResize.bind(controller.view));
});


