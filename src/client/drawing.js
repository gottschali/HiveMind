import * as CONSTANTS from './constants.js';
import * as HEX from './hexlib.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {BufferGeometry,
        MeshStandardMaterial,
        CylinderBufferGeometry,
        LineBasicMaterial,
        EdgesGeometry,
        LineSegments,
        Vector3,
        Mesh,
        Line,
        Group,
        WebGLRenderer,
        PerspectiveCamera,
        Scene,
        AmbientLight
       } from 'three';

import {teams} from '../shared/model/teams.js';
import MATERIALS from './textures.js';

// TODO use common Hexlib

// radiusTop, radiusBottom, height, radialSegments
const hexGeometry = new CylinderBufferGeometry( 1, 1, 0.5, 6 );
const wireframeGeometry = new EdgesGeometry( hexGeometry );
const wireframeMaterial = new LineBasicMaterial( { color: CONSTANTS.BLACK, linewidth: 5 });
const wireframe = new LineSegments( wireframeGeometry, wireframeMaterial );
const highlightMaterial = new MeshStandardMaterial({color: CONSTANTS.FG,
    polygonOffset: true,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    transparent: true,
    opacity: 0.3,
});

class Painter {
    constructor(canvas) {
        this.canvas = canvas;
        // Setup Hexlib
        this.orientation = HEX.Layout.flat;
        this.size = new HEX.Point(1, 1);
        this.origin = new HEX.Point(0, 0);
        this.layout = new HEX.Layout(this.orientation, this.size, this.origin);

        // Setup Renderer
        this.renderer = new WebGLRenderer( {canvas, antialias: true} );
        this.renderer.setClearColor(CONSTANTS.BG);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Setup Camera
        const fov = 80; // field of view
        const aspect = window.innerWidth / window.innerHeight;  // the canvas default
        const near = 0.1;
        const far = 100;
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set( 0, -15, 20 );
        this.camera.lookAt(0, 0, 0);

        // Setup Scene
        this.scene = new Scene();

        const ambientLight = new AmbientLight( CONSTANTS.WHITE , 1 );
        ambientLight.position.set( 10, -10, 15 );
        this.scene.add( ambientLight );

        // Add the ground plane
        this.addPlane();

        // contains all stones
        this.tile_group = new Group();
        this.scene.add(this.tile_group);
        this.tileArray = [];

        this.dropArr = [];
        this.dropGroup = new Group();
        this.dropGroup.position.set(0, 0, -10);
        // Position it relatively to the camera so it always stays at the same position
        this.camera.add(this.dropGroup);
        this.scene.add(this.camera);


        this.highlightGroup= new Group();
        this.highlightArray = [];
        this.scene.add( this.highlightGroup );

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

    addPlane() {
        // Add a flat hex plane
        let points = [];
        let corners = this.layout.polygonCorners(new HEX.Hex(0, 0));
        corners.forEach(({x, y}) => points.push( new Vector3(x, y, 0)));
        points.push(corners[0]);
        const geometry = new BufferGeometry().setFromPoints( points );
        const material = new LineBasicMaterial( { color: CONSTANTS.FG } );
        const flatHexLine = new Line(geometry, material);
        const group = new Group();
        const radius = 10;
        // Hexagon of hexes with radius of 10
        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min( radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                const {x, y} = this.layout.hexToPixel(new HEX.Hex(q, r));
                const tile = flatHexLine.clone();
                tile.position.set(x, y, -0.25);
                group.add(tile);
            }
        }
        this.scene.add(group);
    }


    render() {
        // TODO implement change on window resize
        this.renderer.render(this.scene, this.camera); // Actual rendering
    }
    color(team) {
        return (team === teams.WHITE ? CONSTANTS.YELLOW : CONSTANTS.CYAN);
    }

    makeGenericStone( hex, height, material) {
        // Create a 3D object at the position given by hex and height
        // Add a wireframe
        const stone = new Mesh( hexGeometry, material );
        stone.add( wireframe.clone() ); // Don't add to the scene directly, make it a child
        this.positionStone(stone, hex, height)
        return stone;
    }
    makeDroppedStone(team, hex, name, height) {
        const materials = [
            MATERIALS[team]["PLAIN"],
            MATERIALS[team][name],
            MATERIALS[team]["PLAIN"],
        ];
        return this.makeGenericStone( hex, height, materials );
    }

    positionStone(stone, hex, height) {
        const {x, y} = this.layout.hexToPixel(hex);
        stone.position.set( x, y, height * 0.5 );
        stone.rotateX(Math.PI / 2);
        stone.rotateY(Math.PI / 6);
    }

    makeHighlightStones(hexes) {
        this.highlightGroup.clear();
        this.highlightArray.length = 0;
        hexes.forEach( ([hex, height]) => {
            const stone = this.makeGenericStone(hex, height, highlightMaterial)
            this.highlightGroup.add(stone);
            this.highlightArray.push(stone);
        });
        this.render();
    }
// TODO abstract team colors

    makeDropTileInstances(arr) {
        arr.sort( (a, b) => (a.team === b.team) ? a.insect < b.insect : a.team < b.team);
        this.dropGroup.clear();
        this.dropArr.length = 0; 
        let x = -10;
        let prev = null;
        let dy = 0;
        for (const stone of arr) {
            if (prev != null && stone.team === prev.team && stone.insect === prev.insect) {
                dy += 1;
            } else {
                dy = 0;
                x += 2;
            }
            prev = stone;
            const material = MATERIALS[stone.team][stone.insect];
            // Add a wireframe
            const tile = new Mesh( hexGeometry, material );
            tile.rotateX(Math.PI / 2);
            tile.rotateY(Math.PI / 4);
            tile.position.set(x, 10 + dy, -10);
            tile.insect = stone.insect;
            tile.add( wireframe.clone() ); // Don't add to the scene directly, make it a child
            this.dropGroup.add(tile);
            this.dropArr.push(tile);
        }
    }


    drawState(state) {
        // clear the previous hexes
        this.tile_group.clear();
        this.tileArray.length = 0;
        // TODO: optimize: drop: only add new insect, move: move the object to new destination
        // Maybe outsource this loops to hive
        console.log("======", state.hive.map)
        for (const hex of state.hive.map.keys()) {
            state.hive.map.get(hex).forEach((stone, height) => {
                const newInst = this.makeDroppedStone(stone.team, new HEX.Hex(hex.q, hex.r), stone.insect, height);
                this.tileArray.push(newInst);
                this.tile_group.add(newInst);
            });
        }
        console.log("========", state.hive.map)
        this.makeDropTileInstances(state.stones);
        this.render();
    }


}

export {Painter};