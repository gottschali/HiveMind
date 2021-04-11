import {Controller} from "./controller/GameController.js";
import {HumanController} from "./controller/HumanController";
import {RandomComputerController} from "./controller/RandomComputerController";

const canvas = document.createElement('canvas');
canvas.id = "container";
const element = document.createElement('div');

new Controller(RandomComputerController, RandomComputerController, canvas);

document.body.appendChild(element);
document.body.appendChild(canvas);

