import {Raycaster, Vector3} from './three.module.js';

import {Painter} from './modules/drawing.js';
import * as CONSTANTS from './modules/constants.js';


const canvas = document.querySelector('#c');
var Paint = new Painter(canvas);


// Connect to the Socket.IO server.
// The connection URL has the following format, relative to the current page:
//     http[s]://<domain>:<port>[/<namespace>]
var socket = io();
$(document).ready(function() {
    socket.on('connect', function() {
        console.log("Client connected");
    }, function(json) { // Callback
        Paint.drawState(json);
    });

    socket.on('sendstate', function(json) {
        console.log("Received State");
        Paint.drawState(json);
        state = "IDLE";
        return false;
    });

    $('form#test').submit(function(event) {
        console.log("Client requests Action");
        socket.emit('ai_action');
        return false;
    });
    $('form#automove').submit(function(event) {
        console.log("Client requesting AUTO actions");
        socket.emit('auto_action');
        return false;
    });
    $('form#resetgame').submit(function(event) {
        console.log("Client reset");
        socket.emit('reset');
        return false;
    });
});


function emitAction(hex) {
    // accepts hex as target for drop / move
    console.log("Action", actionType, firstArg, hex);
    socket.emit('action', {'type': actionType, 'first': firstArg, 'destination': hex});
}

function emitOptions() {
    console.log("Options", actionType, firstArg);
    socket.emit('options', {'type': actionType, 'first': firstArg},
                function (json) {
                    console.log("Client received options from server", json);
                    var hexes = JSON.parse(json);
                    Paint.makeHighlightInstances(hexes);
                });
}

var firstArg = null;
var actionType = null;

var previousSelection = null;
var dropSelection = null;

const IDLE = "idle";
const WAITING = "waiting";
const SELECTED = "selected";
var state = IDLE;

function onDocumentMouseDown( event ) {
        console.log("state: ", state);
        if (state === WAITING) return;
        event.preventDefault();
        var mouse3D = new Vector3(
            ( ( event.clientX - canvas.offsetLeft ) / canvas.width ) * 2 - 1,
            -( ( event.clientY - canvas.offsetTop ) / canvas.height ) * 2 + 1,
            0.5 );
        var raycaster =  new Raycaster();
        raycaster.setFromCamera( mouse3D, Paint.camera );

        var intersects = raycaster.intersectObjects( Paint.tileArray );
        var intersectsTarget = raycaster.intersectObjects( Paint.highlightArray );
        var intersectsDrop = raycaster.intersectObjects( Paint.dropArr );
        console.log(intersectsTarget);
        if ( intersectsTarget.length > 0 ) {

            var target = intersectsTarget[ 0 ];
            const newHex = Paint.layout.pixelToHex(target.point).round();
            console.log(newHex);
            state = IDLE;
            // TODO: abstract state change
            Paint.highlightGroup.clear();
            console.log("actiontype", actionType);
            emitAction(newHex);
        }
        else if (intersectsDrop.length > 0) {
            var drop = intersectsDrop[ 0 ].object;
            console.log(drop);
            dropSelection = drop.insect;
            previousSelection = null;
            state = SELECTED;
            console.log("selected drop", dropSelection);
            actionType = "drop";
            firstArg = dropSelection;
            emitOptions();
        }
        else if ( intersects.length > 0 ) {
            dropSelection = null;
            var selected = intersects[ 0 ];
            console.log("selected-highligh", selected, previousSelection);
            if (previousSelection !== null && previousSelection.id == selected.object.id) {
                console.log("selected the same again", previousSelection.previous);
                selected.object.material.color.setHex( previousSelection.previous );
                previousSelection = null;
                state = IDLE;
            }
            else if (previousSelection === null || previousSelection.id != selected.object.id) {
                if (previousSelection !== null) {
                    previousSelection.material.color.setHex( previousSelection.previous );
                }
                previousSelection = selected.object;
                previousSelection.previous = selected.object.material.color.getHex();
                selected.object.material.color.set( CONSTANTS.GREEN );
                const newHex = Paint.layout.pixelToHex(selected.point).round();
                console.log(newHex);
                state = SELECTED;
                actionType = "move";
                firstArg = newHex;

                emitOptions();

            }
        }
    }

const localPlayer = new LocalPlayer();
const aiPlayer = new AIPlayer();
const game = new Game(localPlayer, localPlayer);


// call this only in static scenes (i.e., if there is no animation loop)
Paint.controls.addEventListener( 'change', Paint.render.bind(Paint) );

window.addEventListener('resize', Paint.render.bind(Paint));
// window.addEventListener('keydown', (e) => {
    // e.preventDefault();
// });

canvas.addEventListener( "click", this.onDocumentMouseDown );

Paint.render(); // Init Render
