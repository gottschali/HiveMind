import {
    AmbientLight,
    BufferGeometry,
    Group, Line,
    LineBasicMaterial,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector3,
    WebGLRenderer
} from 'three';
import * as HEX from '../../shared/hexlib.js';
import * as CONSTANTS from "./constants";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {HashMap} from "../../shared/hashmap";
import stones from './stones';
import {models} from "./models";
import {hitbox, highlightStone} from "./geometry";

// TODO Can you not store height in another hex attribute

// radiusTop, radiusBottom, height, radialSegments

export class View {
    constructor(parent, canvas) {
        // Where do we get canvas from
        this.parent = parent;
        this.canvas = canvas;

        this.layout = this.setupHexlib(HEX.layout_flat);

        this.setupScene(canvas);

        // Add the ground plane
        this.addPlane();

        // contains all stones
        this.tile_group = new Group();
        this.scene.add(this.tile_group);
        this.tileArray = [];

        this.hive = new HashMap()
        // Position it relatively to the camera so it always stays at the same position
        this.scene.add(this.camera);

        this.highlightGroup= new Group();
        this.highlightArray = [];
        this.scene.add( this.highlightGroup );

        this.setupControls();

        // Currently not working
        window.addEventListener("resize", this.render.bind(this));

        this.clickListener = canvas.addEventListener("click", this.getIntersections.bind(this));

        this.render();
        this.controls.addEventListener("change", this.render.bind(this));
    }
    setupHexlib(orientation) {
        const size = new HEX.Point(1, 1);
        const origin = new HEX.Point(0, 0);
        return new HEX.Layout(orientation, size, origin);
    }
    setupScene(canvas) {
        this.renderer = new WebGLRenderer( {canvas, antialias: true, alpha: true } );
        // this.renderer.setClearColor(CONSTANTS.BG);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const fov = 80; // field of view
        const aspect = window.innerWidth / window.innerHeight;  // the canvas default
        const near = 0.1;
        const far = 100;

        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set( 0, -5, 10 );
        this.camera.lookAt(0, 0, 0);

        this.scene = new Scene();

        const ambientLight = new AmbientLight( CONSTANTS.WHITE , 1 );
        ambientLight.position.set( 10, -10, 15 );
        this.scene.add( ambientLight );
    }
    setupControls() {
        this.controls = new OrbitControls (this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.5;
        this.controls.enableZoom = true;
        this.controls.maxAzimuthAngle = Math.PI / 2;
        this.controls.minAzimuthAngle = -Math.PI / 2;
        this.controls.maxDistance = 90;
        this.controls.minDistance = 5;
        this.controls.update();
    }
    getIntersections (event) {
        // This should emit what was done and return it to the controller
        // The player controllers are then in charge of the logic
        event.preventDefault();
         // Find out what was clicked
        const mouse3D = new Vector3(
            ((event.clientX - this.canvas.offsetLeft) / this.canvas.width) * 2 - 1,
            -((event.clientY - this.canvas.offsetTop) / this.canvas.height) * 2 + 1,
            0.5);
        const raycaster = new Raycaster();
        raycaster.setFromCamera(mouse3D, this.camera);
        const map = {
            destination: this.highlightArray,
            stones: this.tileArray,
        };
        this.highlightGroup.clear();
        for (const type in map) {
            const clicked = raycaster.intersectObjects(map[type]);
            if (clicked.length) {
                const c = clicked[0]
                let second;
                if (type === "destination" || type === "stones") {
                    second = HEX.hex_round(HEX.pixel_to_hex(this.layout, c.point));
                }
                console.log([type, second])
                return this.parent.handleClick([type, second]);
            }
        }
    }
    addPlane() {
        // Add a flat hex plane
        let points = [];
        let corners = HEX.polygon_corners(this.layout, new HEX.Hex(0, 0));
        corners.forEach(({x, y}) => points.push( new Vector3(x, y, 0)));
        points.push(corners[0]);
        const geometry = new BufferGeometry().setFromPoints( points );
        const material = new LineBasicMaterial( { color: CONSTANTS.BLACK } );
        const flatHexLine = new Line(geometry, material);
        const group = new Group();
        const radius = 10;
        // Hexagon of hexes with radius of 10
        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min( radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                const {x, y} = HEX.hex_to_pixel(this.layout, new HEX.Hex(q, r));
                const tile = flatHexLine.clone();
                tile.position.set(x, y, 0);
                group.add(tile);
            }
        }
        this.scene.add(group);
    }
    render() {
        // TODO implement change on window resize
        this.renderer.render(this.scene, this.camera); // Actual rendering
    }
    makeDroppedStone(team, hex, insect, height) {
        // Instead just add it to the scene and give it enough attributes
        // that in future it can be found easily
        const stone = stones[team][insect].clone();
        const hb = hitbox.clone();
        stone.add(hb);
        this.positionStone(stone, hex, height)
        const model = models[insect].clone();
        stone.add(model);
        this.tileArray.push(hb);
        this.tile_group.add(stone);
        return stone;
    }

    positionStone(stone, hex, height) {
        const {x, y} = HEX.hex_to_pixel(this.layout, hex);
        stone.position.set( x, y, height + 0.5);
    }

    makeHighlightStones(hexes) {
        this.highlightGroup.clear();
        this.highlightArray.length = 0;
        hexes.forEach( ([hex, height]) => {
            const stone = highlightStone.clone();
            this.positionStone(stone, hex, height - 0.375);
            this.highlightGroup.add(stone);
            this.highlightArray.push(stone);
        });
        this.render();
    }
    drawState(state) {
        // clear the previous hexes
        this.tile_group.clear();
        this.tileArray.length = 0;
        // TODO: optimize: drop: only add new insect, move: move the object to new destination
        // Maybe outsource this loops to hive
        for (const hex of state.hive.map.keys()) {
            state.hive.map.get(hex).forEach((stone, height) => {
                this.makeDroppedStone(stone.team, new HEX.Hex(hex.q, hex.r), stone.insect, height);
            });
        }
        this.render();
    }
    addStone(stone, destination) {
        // Maybe need to reinstantiate destination as a hex
        const height = 0
        console.log("Add stone", stone, destination, height)
        const newInst = this.makeDroppedStone(stone.team, destination, stone.insect, height);
        this.hive.hivePush(destination, newInst)
    }
    moveStone(origin, destination) {
        console.log("Move stone", origin, destination)
        const stone = this.hive.hivePop(origin)
        const height = this.hive.hiveHeight(destination) // Maybe + 1
        // could animate here
        this.hive.hivePush(destination, stone)
        this.positionStone(stone, destination, height)
    }
    apply(action) {
        // It's a drop
        if ("stone" in action) {
            // Do not even remove it from droparr as this will be deprecated soon
            this.addStone(action.stone, action.destination)
        } else if ("origin" in action) {
            this.moveStone(action.origin, action.destination)
        }
        this.render();
    }
}
