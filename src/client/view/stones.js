import {insects} from "../../shared/model/insects";
import {
    Mesh,
    MeshLambertMaterial,
    Group
} from "three";
import * as CONSTANTS from "./constants";

import {wireframe, socketGeometry} from './geometry';

let stones = {
    "WHITE": {},
    "BLACK": {}
};

for (const team of ["WHITE", "BLACK"]) {
    const material = new MeshLambertMaterial({color: CONSTANTS.TEAMS[team]});
    Object.values(insects).forEach((insect) => {
        const stone = new Group();
        const socket = new Mesh(socketGeometry, material);
        socket.add(wireframe.clone()); // Don't add to the scene directly, make it a child
        socket.position.y -= 0.375;
        stone.add(socket);
        stone.rotateX(Math.PI / 2);
        stone.rotateY(Math.PI / 6);
        stones[team][insect] = stone;
    });
}

export default stones;
