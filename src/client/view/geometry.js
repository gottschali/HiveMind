import {
    CylinderBufferGeometry,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshStandardMaterial
} from "three";
import * as CONSTANTS from "./constants";
import {teams} from '../../shared/model/teams';

export const hexGeometry = new CylinderBufferGeometry( 1, 1, 1, 6 );
export const socketGeometry = new CylinderBufferGeometry( 1, 1, 0.25, 6 );
const wireframeGeometry = new EdgesGeometry( socketGeometry );
const wireframeMaterial = new LineBasicMaterial( { color: CONSTANTS.BLACK });
export const wireframe = new LineSegments( wireframeGeometry, wireframeMaterial );

export const highlightStones = {};
Object.values(teams).forEach( (team) => {
    const highlightMaterial = new MeshStandardMaterial(
        {
            color: CONSTANTS.TEAMS[team],
            polygonOffset: true,
            polygonOffsetFactor: 0,
            polygonOffsetUnits: 0,
            transparent: true,
            opacity: 0.3,
        }
    );
    const stone = new Mesh(socketGeometry, highlightMaterial);
    stone.rotateX(Math.PI / 2);
    stone.rotateY(Math.PI / 6);
    highlightStones[team] = stone;
});


export const invisibleMaterial = new MeshStandardMaterial({
    polygonOffset: true,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    transparent: true,
    opacity: 0,
});
export const hitbox = new Mesh(hexGeometry, invisibleMaterial);
