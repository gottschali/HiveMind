// Import the modules
import * as THREE from './three.module.js';
import * as HEX from './hexlib.js';
import * as ORBIT from './OrbitControls.js';

const BLACK = '#1E212B';
const BG = '#002b36';
const FG = '#fdf6e3';
const WHITE = "#ffffff";

const YELLOW = '#b58900';
const ORANGE = '#cb4b16';
const RED = '#dc322f';
const MAGENTA = '#d33682';
const VIOLET = '#6c71c4';
const BLUE = '#268bd2';
const CYAN = '#2aa198';
const GREEN = '#859900';

// fix lighting

// Draw on the canvas
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setClearColor(FG); // background color

// Defines the camera pyramid slant
const fov = 80; // field of view
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// Set camera position
camera.position.set( 0, -7, 5 );
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

var ambientLight = new THREE.AmbientLight( WHITE , 1 );
ambientLight.position.set( 10, -10, 15 );
scene.add( ambientLight );

// Creates a fog to hide that the ground is finite
scene.background = new THREE.Color( BG );
scene.fog = new THREE.Fog( BG , 11, 44 );

// Control for moving around the scene
const controls = new ORBIT.OrbitControls (camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.enableZoom = true;
controls.maxAzimuthAngle = Math.PI / 2;
controls.minAzimuthAngle = -Math.PI / 2;
controls.maxDistance = 90;
controls.minDistance = 5;

// Setting up Hexlib
const orientation = HEX.Layout.flat;
const size = new HEX.Point(1, 1);
const origin = new HEX.Point(0, 0);
const layout = new HEX.Layout(orientation, size, origin);

// Preload all images and store the textures in a hashmap for every insect
const loader = new THREE.TextureLoader();
var names = ["grasshopper", "bee", "ant", "spider", "beetle"];
var textures = {};
names.forEach( name => textures[name] = loader.load( `./static/assets/${name}.jpeg` ) );

// Add a flat hex plane
const points = [];
layout.polygonCorners(new HEX.Hex(0, 0)).forEach(({x, y}) => points.push( new THREE.Vector3(x, y, 0)));
const flatHexGeometry = new THREE.BufferGeometry().setFromPoints( points );
const flatHexMaterial = new THREE.LineBasicMaterial( { color: FG } );
const flatHexLine = new THREE.Line(flatHexGeometry, flatHexMaterial);
var planeGroup = new THREE.Group();
for (var q=-100; q<100; q++ ){
    for (var r=-100; r<100; r++){
        const hex = new HEX.Hex(q, r);
        if (hex.len() < 66) {
            const {x, y} = layout.hexToPixel(hex);
            var flatHexTile = flatHexLine.clone();
            flatHexTile.position.set(x, y, -0.25);
            planeGroup.add(flatHexTile);
        }
    }
}
scene.add(planeGroup);

// radiusTop, radiusBottom, height, radialSegments
const hexGeometry = new THREE.CylinderBufferGeometry( 1, 1, 0.5, 6 ); 
const wireframeGeometry = new THREE.EdgesGeometry( hexGeometry );
const wireframeMaterial = new THREE.LineBasicMaterial( { color: BLACK, linewidth: 5 });
const wireframe = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );

function makeTileInstance(team, hex, name, height) {
    // Create a 3D object at the position given by hex and height
    // Can be precomputed
    var material = new THREE.MeshStandardMaterial({color: (team ? MAGENTA : YELLOW),
                                                   polygonOffset: true,
                                                   polygonOffsetFactor: 1, // positive value pushes polygon further away
                                                   polygonOffsetUnits: 0,
                                                   map: textures[name],
                                                   roughness: 0.5,
                                                   metalness: 0.5,
                                                  });
    // Add a wireframe
    const tile = new THREE.Mesh(hexGeometry, material);
    tile.add( wireframe.clone() ); // Don't add to the scene directly, make it a child
    const {x, y} = layout.hexToPixel(hex);
    tile.position.set( x, y, height * 0.5 );
    tile.rotateX(Math.PI / 2);
    tile.rotateY(Math.PI / 6);
    return tile;
}

// contains all insects
var tile_group = new THREE.Group();
scene.add(tile_group);

function render() {
    controls.update();
    if (resizeRendererTodisplaySize(renderer)) {
        // update camera settings if the screen is resized
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera); // Actual rendering
    // continue looping
    requestAnimationFrame(render);
}

function resizeRendererTodisplaySize(renderer) {
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function drawState(json) {
    var state = JSON.parse(json);
    // clear the previous hexes
    tile_group.clear();
    // TODO: optimize: drop: only add new insect, move: move the object to new destination
    for (const insect of state.hive) {
        tile_group.add(makeTileInstance(insect.team, new HEX.Hex(insect.q, insect.r), insect.name, insect.height));
    }
}

$(document).ready(function() {
    // Connect to the Socket.IO server.
    // The connection URL has the following format, relative to the current page:
    //     http[s]://<domain>:<port>[/<namespace>]
    var socket = io();

    // Event handler for new connections.
    // The callback function is invoked when a connection with the
    // server is established.
    socket.on('connect', function() {
        console.log("Client connected");
        socket.emit('client_connect', {data: 'I\'m connected!'});
    });

    // Event handler for server sent data.
    // The callback function is invoked whenever the server emits data
    // to the client. The data is then displayed in the "Received"
    // section of the page.
    socket.on('sendstate', function(json) {
        console.log("Client received data from server");
        console.log(json);
        drawState(json);
        return false;
    });

    // Handlers for the different forms in the page.
    // These accept data from the user and send it to the server in a
    // variety of ways
    $('form#test').submit(function(event) {
        console.log("Client requesting move");
        socket.emit('test', {data: 'RequestMove'});
        return false;
    });
    $('form#automove').submit(function(event) {
        console.log("Client requesting AutoMove");
        socket.emit('auto_move', {data: 'RequestAutoMove'});
        return false;
    });
});


render(); // Start the render loop

