import * as THREE from './three.module.js';
import * as HEX from './hexlib.js';
import * as ORBIT from './OrbitControls.js';

const BLACK = '#000000';
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

// Draw on the canvas
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setClearColor(BG); // background color
renderer.setSize(window.innerWidth, window.innerHeight);

// Defines the camera pyramid slant
const fov = 80; // field of view
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// Set camera position
camera.position.set( 0, -15, 20 );
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

var ambientLight = new THREE.AmbientLight( WHITE , 1 );
ambientLight.position.set( 10, -10, 15 );
scene.add( ambientLight );

// Creates a fog to hide that the ground is finite
// Disabled for performance
// scene.background = new THREE.Color( BG );
// scene.fog = new THREE.Fog( BG , 30, far );

// Control for moving around the scene
const controls = new ORBIT.OrbitControls (camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.enableZoom = true;
controls.maxAzimuthAngle = Math.PI / 2;
controls.minAzimuthAngle = -Math.PI / 2;
controls.maxDistance = 90;
controls.minDistance = 5;
controls.update();

// Setting up Hexlib
const orientation = HEX.Layout.flat;
const size = new HEX.Point(1, 1);
const origin = new HEX.Point(0, 0);
const layout = new HEX.Layout(orientation, size, origin);

// Preload all images and store the textures in a hashmap for every insect
// TODO: Load the texture only on top and not on all sides
const loader = new THREE.TextureLoader();
var names = ["grasshopper", "bee", "ant", "spider", "beetle"];
var textures = {};
names.forEach( name => textures[name] = loader.load( `./static/assets/${name}.jpeg` ) );

// Add a flat hex plane
var points = [];
var corners =  layout.polygonCorners(new HEX.Hex(0, 0));
corners.forEach(({x, y}) => points.push( new THREE.Vector3(x, y, 0)));
points.push(corners[0]);
const flatHexGeometry = new THREE.BufferGeometry().setFromPoints( points );
const flatHexMaterial = new THREE.LineBasicMaterial( { color: FG } );
const flatHexLine = new THREE.Line(flatHexGeometry, flatHexMaterial);
var planeGroup = new THREE.Group();
const radius = 10;
for (var q = -radius; q <= radius; q++) {
    var r1 = Math.max(-radius, -q - radius);
    var r2 = Math.min( radius, -q + radius);
    for (var r = r1; r <= r2; r++) {
        const {x, y} = layout.hexToPixel(new HEX.Hex(q, r));
        var flatHexTile = flatHexLine.clone();
        flatHexTile.position.set(x, y, -0.25);
        planeGroup.add(flatHexTile);
    }
}
scene.add(planeGroup);

// radiusTop, radiusBottom, height, radialSegments
const hexGeometry = new THREE.CylinderBufferGeometry( 1, 1, 0.5, 6 );
const wireframeGeometry = new THREE.EdgesGeometry( hexGeometry );
const wireframeMaterial = new THREE.LineBasicMaterial( { color: BLACK, linewidth: 5 });
const wireframe = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );

const insectMap = {1: "bee",
                   2: "spider",
                   3: "ant",
                   4: "grasshopper",
                   5: "beetle"};
function makeTileInstance(team, hex, name, height) {
    // Create a 3D object at the position given by hex and height
    // Can be precomputed
    var material = new THREE.MeshStandardMaterial({color: (team ? MAGENTA : YELLOW),
                                                   polygonOffset: true,
                                                   polygonOffsetFactor: 5, // positive value pushes polygon further away
                                                   polygonOffsetUnits: 1,
                                                   map: textures[insectMap[name]],
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

var highlightMaterial = new THREE.MeshStandardMaterial({color: FG,
                                                        polygonOffset: true,
                                                        polygonOffsetFactor: 0,
                                                        polygonOffsetUnits: 0,
                                                        transparent: true,
                                                        opacity: 0.3,
                                                       });

var highlightGroup= new THREE.Group();
var highlightArray = [];
scene.add(highlightGroup);
function makeHighlightInstances(hexes) {
    highlightGroup.clear();
    highlightArray.length = 0;
    hexes.forEach( ({q, r, h}) => {
        const {x, y} = layout.hexToPixel(new HEX.Hex(q, r));
        const tile = new THREE.Mesh(hexGeometry, highlightMaterial);
        tile.position.set( x, y, h * 0.5 );
        tile.rotateX(Math.PI / 2);
        tile.rotateY(Math.PI / 6);
        highlightGroup.add(tile);
        highlightArray.push(tile);
    });
    render();
}

var dropArr = [];
var dropGroup = new THREE.Group();
dropGroup.position.set(0, 0, -10);
camera.add(dropGroup);
scene.add(camera);
function compareStone(a, b) {
    return (a.team == b.team) ? a.name < b.name : a.team < b.team;
}

const dropGeometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.05, 0.6 );
function makeDropTileInstances(arr) {
    arr.sort(compareStone);
    dropGroup.clear();
    dropArr.length = 0; 
    var x = -10;
    var prev = null;
    var dy = 0;
    for (const stone of arr) {
        console.log(stone);
        if (prev != null && stone.team == prev.team && stone.name == prev.name) {
            dy += 1;
        } else {
            dy = 0;
            x += 2;
        }
        prev = stone;
        var material = new THREE.MeshStandardMaterial({color: (stone.team ? MAGENTA : YELLOW),
                                                   polygonOffset: true,
                                                   polygonOffsetFactor: 5,
                                                   polygonOffsetUnits: 1,
                                                   map: textures[insectMap[stone.name]],
                                                   roughness: 0.5,
                                                   metalness: 0.5,
                                                  });
        // Add a wireframe
        const tile = new THREE.Mesh(hexGeometry, material);
        tile.rotateX(Math.PI / 2);
        tile.rotateY(Math.PI / 4);
        tile.position.set(x, 10 + dy, -10);
        tile.insect = stone.name;
        tile.add( wireframe.clone() ); // Don't add to the scene directly, make it a child
        dropGroup.add(tile);
        console.log(tile);
        dropArr.push(tile);
    }
}


// contains all insects
var tile_group = new THREE.Group();
scene.add(tile_group);

function render() {
    if (resizeRendererTodisplaySize(renderer)) {
        // update camera settings if the screen is resized
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera); // Actual rendering
    // continue looping
    // requestAnimationFrame(render);
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
var tileArray = [];

function drawState(json) {
    var state = JSON.parse(json);
    // clear the previous hexes
    tile_group.clear();
    tileArray.length = 0;
    // TODO: optimize: drop: only add new insect, move: move the object to new destination
    for (const insect of state.hive) {
        var newInst = makeTileInstance(insect.team, new HEX.Hex(insect.q, insect.r), insect.name, insect.height);
        tileArray.push(newInst);
        tile_group.add(newInst);
    }
    makeDropTileInstances(state.availables);
    render();
}

// Connect to the Socket.IO server.
// The connection URL has the following format, relative to the current page:
//     http[s]://<domain>:<port>[/<namespace>]
var socket = io();
$(document).ready(function() {
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
        state = "IDLE";
        return false;
    });

    socket.on('moveoptions', function(json) {
        console.log("Client received options from server");
        console.log(json);
        var hexes = JSON.parse(json);
        console.log(hexes);
        makeHighlightInstances(hexes);
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
    $('form#resetgame').submit(function(event) {
        console.log("Client requesting reset");
        socket.emit('reset');
        return false;
    });
    // Request the first move by default
    socket.emit('test', {data: 'RequestMove'});
});

function emitSelectHex(hex) {
    console.log("Client selected hex", hex);
    socket.emit('selecthex', {'data': hex});
}

function emitSelectDrop(insect){
    console.log("Client selected insect for drop", insect);
    socket.emit('selectdrop', {'data': insect});
}

function emitTargetHex(hex) {
    console.log("Client makes move", hex);
    // -> app.py
    // listen on new state
    socket.emit('targethex', {'data': hex});
    state = WAITING;
    socket.emit('test', {data: 'RequestMove'});
}

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
    var mouse3D = new THREE.Vector3(
        ( ( event.clientX - canvas.offsetLeft ) / canvas.width ) * 2 - 1,
        -( ( event.clientY - canvas.offsetTop ) / canvas.height ) * 2 + 1,
          0.5 );
    var raycaster =  new THREE.Raycaster();
    raycaster.setFromCamera( mouse3D, camera );
    var intersects = raycaster.intersectObjects( tileArray );
    var intersectsTarget = raycaster.intersectObjects( highlightArray );
    var intersectsDrop = raycaster.intersectObjects( dropArr );
    console.log(intersects, intersectsTarget, intersectsDrop);
    if ( intersectsTarget.length > 0 ) {

        var target = intersectsTarget[ 0 ];
        const newHex = layout.pixelToHex(target.point).round();
        console.log(newHex);
        state = IDLE;
        // TODO: abstract state change
        highlightGroup.clear();
        emitTargetHex(newHex);
    }
    else if (intersectsDrop.length > 0) {
        var drop = intersectsDrop[ 0 ].object;
        console.log(drop);
        dropSelection = drop.insect;
        previousSelection = null;
        state = SELECTED;
        console.log("selected drop", dropSelection);
        emitSelectDrop(dropSelection);
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
            selected.object.material.color.set( GREEN );
            const newHex = layout.pixelToHex(selected.point).round();
            console.log(newHex);
            state = SELECTED;
            emitSelectHex(newHex);

        }
    }
}
canvas.addEventListener( "click", onDocumentMouseDown );

// call this only in static scenes (i.e., if there is no animation loop)
controls.addEventListener( 'change', render ); 

window.addEventListener('resize', render);
window.addEventListener('keydown', (e) => {
    e.preventDefault();
});

render(); // Init Render
