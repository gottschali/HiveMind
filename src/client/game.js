
import {Raycaster, Vector3} from 'three';

import {Painter} from './drawing.js';
import * as CONSTANTS from './constants.js';

const IDLE = "idle";
const WAITING = "waiting";
const SELECTED = "selected";

export class Game {
  constructor(canvas) {
    console.log(`Setting up Game`)
    this.canvas = canvas;
    
  }
  init() {
    this.Paint = new Painter(this.canvas);
    var firstArg = null;
    var actionType = null;

    var previousSelection = null;
    var dropSelection = null;


  var state = IDLE;

  function onDocumentMouseDown( event ) {
        console.log("state: ", state);
        if (state === WAITING) return;
        event.preventDefault();
        var mouse3D = new Vector3(
            ( ( event.clientX - this.canvas.offsetLeft ) / this.canvas.width ) * 2 - 1,
            -( ( event.clientY - this.canvas.offsetTop ) / this.canvas.height ) * 2 + 1,
            0.5 );
        var raycaster =  new Raycaster();
        raycaster.setFromCamera( mouse3D, this.Paint.camera );

        var intersects = raycaster.intersectObjects( this.Paint.tileArray );
        var intersectsTarget = raycaster.intersectObjects( this.Paint.highlightArray );
        var intersectsDrop = raycaster.intersectObjects( this.Paint.dropArr );
        console.log(intersectsTarget);
        if ( intersectsTarget.length > 0 ) {

            var target = intersectsTarget[ 0 ];
            const newHex = this.Paint.layout.pixelToHex(target.point).round();
            console.log(newHex);
            state = IDLE;
            // TODO: abstract state change
            this.Paint.highlightGroup.clear();
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
                const newHex = this.Paint.layout.pixelToHex(selected.point).round();
                console.log(newHex);
                state = SELECTED;
                actionType = "move";
                firstArg = newHex;

                emitOptions();

            }
        }
    }

    // call this only in static scenes (i.e., if there is no animation loop)
    this.Paint.controls.addEventListener( "change", this.Paint.render.bind(this.Paint) );

    window.addEventListener("resize", this.Paint.render.bind(this.Paint));
    this.canvas.addEventListener( "click", onDocumentMouseDown.bind(this) );

    this.Paint.render(); // Init Render
  }
}


// emitActions
// emitOptions
