import {Raycaster, Vector3} from 'three';
import {Painter} from './drawing.js';

export class View {
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
                destination: this.Paint.highlightArray,
                stones: this.Paint.tileArray,
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
                    return this.parent.handleClick([type, second]);
                }
            }
        });
    }
}