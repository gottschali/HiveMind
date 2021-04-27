import * as CONSTANTS from './constants.js';
import * as HEX from '../hexlib.js';
import * as ORBIT from '../OrbitControls.js';

import {BufferGeometry,
        MeshLambertMaterial,
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
        AmbientLight,
        TextureLoader

       } from '../three.module.js';

// import * as THREE from '../three.module.js';


class Painter {
    constructor(canvas) {
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

        const planeGroup = this.addPlane();
        this.scene.add(planeGroup);

        this.loadTextures();

        this.tile_group = new Group();
        this.scene.add(this.tile_group);
        this.tileArray = [];

        this.dropGeometry = new CylinderBufferGeometry( 0.1, 0.1, 0.05, 0.6 );
        // contains all insects

        this.dropArr = [];
        this.dropGroup = new Group();
        this.dropGroup.position.set(0, 0, -10);
        this.camera.add(this.dropGroup);
        this.scene.add(this.camera);

        // radiusTop, radiusBottom, height, radialSegments
        this.hexGeometry = new CylinderBufferGeometry( 1, 1, 0.5, 6 );
        this.wireframeGeometry = new EdgesGeometry( this.hexGeometry );
        this.wireframeMaterial = new LineBasicMaterial( { color: CONSTANTS.BLACK, linewidth: 5 });
        this.wireframe = new LineSegments( this.wireframeGeometry, this.wireframeMaterial );

        this.highlightMaterial = new MeshStandardMaterial({color: CONSTANTS.FG,
                                                                polygonOffset: true,
                                                                polygonOffsetFactor: 0,
                                                                polygonOffsetUnits: 0,
                                                                transparent: true,
                                                                opacity: 0.3,
                                                               });

        this.highlightGroup= new Group();
        this.highlightArray = [];
        this.scene.add( this.highlightGroup );

        this.controls = new ORBIT.OrbitControls (this.camera, this.renderer.domElement);
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
        var points = [];
        var corners = this.layout.polygonCorners(new HEX.Hex(0, 0));
        corners.forEach(({x, y}) => points.push( new Vector3(x, y, 0)));
        points.push(corners[0]);

        const geometry = new BufferGeometry().setFromPoints( points );
        const material = new LineBasicMaterial( { color: CONSTANTS.FG } );
        const flatHexLine = new Line(geometry, material);

        var group = new Group();

        const radius = 10;
        for (var q = -radius; q <= radius; q++) {
            var r1 = Math.max(-radius, -q - radius);
            var r2 = Math.min( radius, -q + radius);
            for (var r = r1; r <= r2; r++) {
                const {x, y} = this.layout.hexToPixel(new HEX.Hex(q, r));
                var tile = flatHexLine.clone();
                tile.position.set(x, y, -0.25);
                group.add(tile);
            }
        }
        return group;
    }
    resizeRendererTodisplaySize(canvas) {
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
        }
        return needResize;
    }

    render() {
        const canvas = document.querySelector('#c');
        if (this.resizeRendererTodisplaySize(canvas)) {
            // update camera settings if the screen is resized
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
        this.renderer.render(this.scene, this.camera); // Actual rendering
    }

    loadTextures() {
        // Preload all images and store the textures in a hashmap for every insect
        // TODO: Load the texture only on top and not on all sides
        const loader = new TextureLoader();
        var names = ["grasshopper", "bee", "ant", "spider", "beetle"];
        this.textures = {};
        names.forEach( name => this.textures[name] = loader.load( `../static/assets/${name}.jpeg` ) );

        this.insectMap = {1: "bee",
                           2: "spider",
                           3: "ant",
                           4: "grasshopper",
                           5: "beetle"};
    }

    makeTileInstance(team, hex, name, height) {
        // Create a 3D object at the position given by hex and height
        // Can be precomputed
        const color = (team ? CONSTANTS.YELLOW : CONSTANTS.CYAN);
        // const materials = [
        // new THREE.MeshLambertMaterial({color: color}),
        // new THREE.MeshLambertdMaterial({color: color, map: textures[insectMap[name]]}),
        // new THREE.MeshLambertMaterial({color: color}),
        // ];
        const material = new MeshLambertMaterial({color: color,
                                                        map: this.textures[this.insectMap[name]]});
        // Add a wireframe
        const tile = new Mesh( this.hexGeometry, material );
        tile.add( this.wireframe.clone() ); // Don't add to the scene directly, make it a child
        const {x, y} = this.layout.hexToPixel(hex);
        tile.position.set( x, y, height * 0.5 );
        tile.rotateX(Math.PI / 2);
        tile.rotateY(Math.PI / 6);
        return tile;
    }

    makeHighlightInstances(hexes) {
        this.highlightGroup.clear();
        this.highlightArray.length = 0;
        hexes.forEach( ({q, r, h}) => {
            const {x, y} = this.layout.hexToPixel(new HEX.Hex(q, r));
            const tile = new Mesh(this.hexGeometry, this.highlightMaterial);
            tile.position.set( x, y, h * 0.5 );
            tile.rotateX(Math.PI / 2);
            tile.rotateY(Math.PI / 6);
            this.highlightGroup.add(tile);
            this.highlightArray.push(tile);
        });
        this.render();
    }

    makeDropTileInstances(arr) {
        arr.sort( (a, b) => (a.team == b.team) ? a.name < b.name : a.team < b.team);
        this.dropGroup.clear();
        this.dropArr.length = 0; 
        var x = -10;
        var prev = null;
        var dy = 0;
        for (const stone of arr) {
            if (prev != null && stone.team == prev.team && stone.name == prev.name) {
                dy += 1;
            } else {
                dy = 0;
                x += 2;
            }
            prev = stone;
            var material = new MeshLambertMaterial({color: (stone.team ? CONSTANTS.YELLOW : CONSTANTS.CYAN),
                                                        map: this.textures[this.insectMap[stone.name]],
                                                        });
            // Add a wireframe
            const tile = new Mesh( this.hexGeometry, material );
            tile.rotateX(Math.PI / 2);
            tile.rotateY(Math.PI / 4);
            tile.position.set(x, 10 + dy, -10);
            tile.insect = stone.name;
            tile.add( this.wireframe.clone() ); // Don't add to the scene directly, make it a child
            this.dropGroup.add(tile);
            this.dropArr.push(tile);
        }
    }


    drawState(json) {
        // TODO not parse here
        const state = JSON.parse(json);
        // clear the previous hexes
        this.tile_group.clear();
        this.tileArray.length = 0;
        // TODO: optimize: drop: only add new insect, move: move the object to new destination
        for (const insect of state.hive) {
            const newInst = this.makeTileInstance(insect.team, new HEX.Hex(insect.q, insect.r), insect.name, insect.height);
            this.tileArray.push(newInst);
            this.tile_group.add(newInst);
        }
        this.makeDropTileInstances(state.availables);
        this.render();
    }


}

export {Painter};
