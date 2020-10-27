// Import the modules
import * as THREE from './js/three.module.js';
import * as HEX from './js/hexlib.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setClearColor("#DDDDDD");

    const fov = 80;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set( 0, -10, 15);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    // const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const geometry = new THREE.CylinderBufferGeometry(1, 1, 0.5, 6); // radiusTop, radiusBottom, height, radialSegments

    const light = new THREE.DirectionalLight(0xFFFFFF, 0.8); // color, intensity
    light.position.set( 0, -10, 15);
    scene.add(light);

    const orientation = HEX.Layout.flat;
    const size = new HEX.Point(1, 1);
    const origin = new HEX.Point(0, 0);
    const layout = new HEX.Layout(orientation, size, origin);

		const loader = new THREE.TextureLoader();

		var names = ["grasshopper", "bee", "ant", "spider", "beetle"];
		var textures = {};
		names.forEach( name => textures[name] = loader.load( `./assets/${name}.jpeg` ) );

    function makeTileInstance(geometry, team, hex, name, height=0) {
        const color = (team ? '#DF1C34' : '#56B6C2');

        // const image = `./assets/${name}.jpeg`;
				// var texture = new THREE.TextureLoader().load( image );
				var texture = textures[name];
				// immediately use the texture for material creation
				//var material = new THREE.MeshBasicMaterial( { map: texture } );
        //var material = loader.load(image, (texture) => {
				var material = new THREE.MeshPhongMaterial({color: color,
																																polygonOffset: true,
																																polygonOffsetFactor: 1, // positive value pushes polygon further away
																																polygonOffsetUnits: 0,
																																map: texture,
																																});
					//return material
				//});
				console.log(material);
				const tileMesh = new THREE.Mesh(geometry, material);
				// wireframe
				var geo = new THREE.EdgesGeometry( tileMesh.geometry ); // or WireframeGeometry
				const wireColor = "#AAAAAA";
				var mat = new THREE.LineBasicMaterial( { color: wireColor , linewidth: 1 } );
				var wireframe = new THREE.LineSegments( geo, mat );
				tileMesh.add( wireframe ); // Don't add to the scene directly, make it a child
				const {x, y} = layout.hexToPixel(hex);
				tileMesh.position.x = x;
				tileMesh.position.y = y;
				tileMesh.position.z = height;
				tileMesh.rotateX(Math.PI / 2);
				tileMesh.rotateY(Math.PI / 6);
				return tileMesh;
    }


		var tile_group = new THREE.Group();
		scene.add(tile_group)

    function render(time) {
        time *= 0.001;  // convert time to seconds

				while (tile_group.children.length) {
					tile_group.remove(tile_group.children[0]);
				}
			  tiles.forEach( tile => tile_group.add(tile) );
        if (resizeRendererTodisplaySize(renderer)) {
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

    var tiles = [];
	  var webSocket = new WebSocket("ws://localhost:5678");
		webSocket.onmessage = function(event) {
			var state = JSON.parse(event.data);
      tiles = [];
			for (const insect of state.hive) {
						const q = insect.q;
						const r = insect.r;
						const height = insect.height;
						const team = insect.team;
						const name = insect.name;
						tiles.push(makeTileInstance(geometry, team, new HEX.Hex(q, r, height), name, height));
			}
			requestAnimationFrame(render);
		};
}

main();
