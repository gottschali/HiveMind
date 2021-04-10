import {Controller, HumanController, RandomComputerController} from "./GameController";

const canvas = document.createElement('canvas');
canvas.id = "container";
const element = document.createElement('div');

new Controller(RandomComputerController, HumanController, canvas);

document.body.appendChild(element);
document.body.appendChild(canvas);

