// Import the modules
import * as THREE from './js/three.module.js';
import * as HEX from './js/hexlib.js';

const BLACK = '#1E212B';
const GREEN = '#4D8B31';
const YELLOW = '#FFC800';
const ORANGE = '#FF8427';
const WHITE = '#FFFFFF';

// TODO Add flat tile plane

function main() {
    // Draw on the canvas
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setClearColor(WHITE); // background color

    // Defines the camera pyramid slant
    const fov = 80; // field of view
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // Set camera position
    camera.position.set( 0, -12, 12 );
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();


    const light = new THREE.DirectionalLight(WHITE, 1); // color, intensity
    light.position.set( 10, -10, 15 );
    scene.add(light);

    const orientation = HEX.Layout.flat;
    const size = new HEX.Point(1, 1);
    const origin = new HEX.Point(0, 0);
    const layout = new HEX.Layout(orientation, size, origin);

		const loader = new THREE.TextureLoader();

    // Preload all images and store the textures in a hashmap for every insect
		var names = ["grasshopper", "bee", "ant", "spider", "beetle"];
		var textures = {};
		names.forEach( name => textures[name] = loader.load( `./assets/${name}.jpeg` ) );


    const hexGeometry = new THREE.CylinderBufferGeometry( 1, 1, 0.5, 6 ); // radiusTop, radiusBottom, height, radialSegments


		const wireframeGeometry = new THREE.EdgesGeometry( hexGeometry );
		const wireframeMaterial = new THREE.LineBasicMaterial( { color: BLACK , linewidth: 1 } );
		const wireframe = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );

    function makeTileInstance(team, hex, name, height) {
        // Create a 3D object at the position given by hex and height
        const color = (team ? WHITE : YELLOW);
				var texture = textures[name];
				var material = new THREE.MeshPhongMaterial({color: color,
																									  polygonOffset: true,
																										polygonOffsetFactor: 1, // positive value pushes polygon further away
																										polygonOffsetUnits: 0,
																										map: texture,
																									 });


        const tile = new THREE.Mesh(hexGeometry, material);
				// wireframe: draw all edges
				tile.add( wireframe.clone() ); // Don't add to the scene directly, make it a child
				const {x, y} = layout.hexToPixel(hex);
				tile.position.x = x;
				tile.position.y = y;
				tile.position.z = height * 0.5;
				tile.rotateX(Math.PI / 2);
				tile.rotateY(Math.PI / 6);
				return tile;
    }

    // contains all insects
		var tile_group = new THREE.Group();
		scene.add(tile_group);

    function render(time) {
        time *= 0.001;  // convert time to seconds

        if (resizeRendererTodisplaySize(renderer)) { // update camera settings if the screen is resized
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
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

	  var webSocket = new WebSocket("ws://localhost:5678");
		webSocket.onmessage = function(event) {
			var state = JSON.parse(event.data);

      // clear the previous hexes
			while (tile_group.children.length) {
					 tile_group.remove(tile_group.children[0]);
			}
			for (const insect of state.hive) { // parse the state
          tile_group.add(makeTileInstance(insect.team, new HEX.Hex(insect.q, insect.r), insect.name, insect.height));
			}
			requestAnimationFrame(render); // redraw the screen
		};
}

main();
