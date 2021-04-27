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
const wireframeGeometry = new EdgesGeometry( hexGeometry );
const wireframeMaterial = new LineBasicMaterial( { color: CONSTANTS.BLACK });
export const wireframe = new LineSegments( wireframeGeometry, wireframeMaterial );

export const highlightMaterial = new MeshStandardMaterial({color: CONSTANTS.FG,
    polygonOffset: true,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    transparent: true,
    opacity: 0.3,
});
export const invisibleMaterial = new MeshStandardMaterial({
    polygonOffset: true,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    transparent: true,
    opacity: 0,
});
export const hitbox = new Mesh(hexGeometry, invisibleMaterial);
