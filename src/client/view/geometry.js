import {
    CylinderBufferGeometry,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshStandardMaterial
} from "three";
import * as CONSTANTS from "./constants";

export const hexGeometry = new CylinderBufferGeometry( 1, 1, 1, 6 );
export const socketGeometry = new CylinderBufferGeometry( 1, 1, 0.25, 6 );
const wireframeGeometry = new EdgesGeometry( socketGeometry );
const wireframeMaterial = new LineBasicMaterial( { color: CONSTANTS.BLACK });
export const wireframe = new LineSegments( wireframeGeometry, wireframeMaterial );

const highlightMaterial = new MeshStandardMaterial({color: CONSTANTS.RED,
    polygonOffset: true,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    transparent: true,
    opacity: 0.3,
});
export const highlightStone = new Mesh(socketGeometry, highlightMaterial);
highlightStone.rotateX(Math.PI / 2);
highlightStone.rotateY(Math.PI / 6);

export const invisibleMaterial = new MeshStandardMaterial({
    polygonOffset: true,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    transparent: true,
    opacity: 0,
});
export const hitbox = new Mesh(hexGeometry, invisibleMaterial);
