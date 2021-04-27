import models from "./models";
import {
    CylinderBufferGeometry,
    EdgesGeometry,
    LineBasicMaterial, LineSegments, Mesh,
    MeshLambertMaterial,
    MeshStandardMaterial
} from "three";
import * as CONSTANTS from "./constants";

const invisibleMaterial = new MeshStandardMaterial({
    polygonOffset: true,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    transparent: true,
    opacity: 0,
});

const hexGeometry = new CylinderBufferGeometry( 1, 1, 0.5, 6 );
const socketGeometry = new CylinderBufferGeometry( 1, 1, 0.2, 6 );
const wireframeGeometry = new EdgesGeometry( hexGeometry );
const wireframeMaterial = new LineBasicMaterial( { color: CONSTANTS.BLACK });
const wireframe = new LineSegments( wireframeGeometry, wireframeMaterial );

const hitbox = new Mesh(hexGeometry, invisibleMaterial);
// TODO Hardcoded constants here is very ugly

const insects = [
    "ANT",
    "BEE",
    "BEETLE",
    "GRASSHOPPER",
    "SPIDER"
];

let stones = {
    "WHITE": {},
    "BLACK": {}
};

for (const team of ["WHITE", "BLACK"]) {
    const material = new MeshLambertMaterial({color: (team === "WHITE" ? CONSTANTS.YELLOW : CONSTANTS.CYAN)});
    insects.forEach((insect) => {
        const stone = new Mesh(socketGeometry, material);
        stone.add(wireframe.clone()); // Don't add to the scene directly, make it a child
        stone.add(hitbox.clone());
        stone.rotateX(Math.PI / 2);
        stone.rotateY(Math.PI / 6);

        stone.add(models[insect]);
        stones[team][insect] = stone;
    });
}

export default stones;
