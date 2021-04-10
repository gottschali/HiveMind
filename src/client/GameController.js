import {State} from '../shared/model/state.js';
import {Raycaster, Vector3} from "three";
import {Painter} from "./drawing.js";
import {Move, Drop} from '../shared/model/action.js'
import {Stone} from '../shared/model/stone.js'

export class Controller {
    constructor(playerController1, playerController2, canvas) {
        // Maybe white black needs to be swapped
        this.white = new playerController1(this);
        this.black = new playerController2(this);
        this.state = new State();
        this.view = new View(this, canvas);
        this.delegate();
    }
    delegate() {
        console.log("Player switched");
        console.log(this.state)
        this.view.Paint.drawState(this.state);
        if (this.state.turnNumber > 0) {
            if (this.state.team === "WHITE") {
                this.white.installHooks();
                this.black.uninstallHooks();
            } else {
                this.white.uninstallHooks();
                this.black.installHooks();
            }
        } else {
            this.white.installHooks();
        }
    }
    handleClick(data) {
        if (this.state.team === "WHITE") {
            if (this.white instanceof HumanController) this.white.handleClick(data);
        } else {
            if (this.black instanceof HumanController) this.black.handleClick(data);
        }
    }
    reviewAction(action) {
        // TODO logic depending on controllers (maybe in their classes)
        this.state.apply(action);
        this.delegate();
    }
    getHighlights(act, src) {
        let opts;
        if (act === Move) {
            opts = this.state.hive.generateMovesFrom(src)
                .map(h => [h, this.state.hive.height(h)]);
        } else if (act === Drop) {
            opts = this.state.generateDrops()
                .map(h => [h, 0]);
        }
        console.log(act, src, opts);
        this.view.Paint.makeHighlightStones(opts);
    }
}

class View {
    constructor(parent, canvas) {
        // Where do we get canvas from
        this.parent = parent;
        this.canvas = canvas;
        this.Paint = new Painter(canvas);
        this.Paint.render(); // Init Render
        this.Paint.controls.addEventListener("change", this.Paint.render.bind(this.Paint));
        // Currently not working
        window.addEventListener("resize", this.Paint.render.bind(this.Paint));

        this.clickListener = this.canvas.addEventListener("click", (event) => {
            // This should emit what was done and return it to the controller
            // The player controllers are then in charge of the logic
            event.preventDefault();

            // Find out what was clicked
            const mouse3D = new Vector3(
                ((event.clientX - this.canvas.offsetLeft) / this.canvas.width) * 2 - 1,
                -((event.clientY - this.canvas.offsetTop) / this.canvas.height) * 2 + 1,
                0.5);
            const raycaster = new Raycaster();
            raycaster.setFromCamera(mouse3D, this.Paint.camera);

            const map = {
                stones: this.Paint.tileArray,
                destination: this.Paint.highlightArray,
                drops: this.Paint.dropArr
            };
            this.Paint.highlightGroup.clear();
            for (const type in map) {
                const clicked = raycaster.intersectObjects(map[type]);
                if (clicked.length) {
                    const c = clicked[0]
                    let second;
                    if (type === "destination" || type === "stones") {
                        second = this.Paint.layout.pixelToHex(c.point).round();
                    } else if (type === "drops") {
                        // Is this attribute set ?!
                        second = c.object.insect;
                    }
                    this.parent.handleClick([type, second]);
                }
            }
        });
    }
}

class PlayerController {
    constructor(parent) {
        this.parent = parent;
    }
    installHooks() {
    }
    uninstallHooks() {
    }
    intendAction( action ) {
        this.parent.reviewAction(action);
    }
}

class LocalController extends PlayerController {
    constructor(...args) {
        super(...args);
    }
}

export class HumanController extends LocalController {
    installHooks() {
        this.firstArg = null;
        this.actionType = null;
    }
    setDestination(hex) {
        const action = new this.actionType(this.firstArg, hex);
        console.log("Action set", action)
        this.intendAction(action);
    }
    wantsHighlights() {
        this.parent.getHighlights(this.actionType, this.firstArg);
    }
    handleClick(data) {
        const [type, selection] = data;
        if (type === "stones") {
            this.firstArg = selection;
            this.actionType = Move;
            this.wantsHighlights()
        }
        else if (type === "destination") {
            this.setDestination(selection)
        }
        else if (type === "drops") {
            this.firstArg = new Stone(selection, this.parent.state.team);
            this.actionType = Drop;
            this.wantsHighlights()
        }
    }
}

class ComputerController extends LocalController {

}

export class RandomComputerController extends ComputerController {
    installHooks() {
        super.installHooks();

        this.intendAction(this.choose(this.parent.state.actions))
    }
    choose(actions) {
        return actions[Math.floor(Math.random() * actions.length)]
    }
}

export class RemoteController extends PlayerController {
}