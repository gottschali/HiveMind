import {MeshLambertMaterial, TextureLoader, LoadingManager} from 'three';
import {insects} from '../../shared/model/insects.js';
import {teams} from '../../shared/model/teams.js';

import ant from '../../assets/ant.jpeg';
import bee from '../../assets/bee.jpeg';
import beetle from '../../assets/beetle.jpeg';
import grasshopper from '../../assets/grasshopper.jpeg';
import spider from '../../assets/spider.jpeg';
import * as CONSTANTS from "./constants";

// Preload all images and store the textures in a hashmap for every insect
export const loadManager = new LoadingManager();
const loader = new TextureLoader(loadManager);
let textures = {};
// TODO Hard coded constants
let map = {
    "ANT": ant,
    "BEE": bee,
    "BEETLE": beetle,
    "GRASSHOPPER": grasshopper,
    "SPIDER": spider
};
Object.keys(insects).forEach(i => textures[i] = loader.load(map[i]));
let materials = {};
const colors = {
    "WHITE": CONSTANTS.YELLOW,
    "BLACK": CONSTANTS.CYAN
}
for (const team in teams) {
    materials[team] = {}
    materials[team]["PLAIN"] = new MeshLambertMaterial({color: colors[team]});
}
for (const team in teams) for (const insect in textures) {
    materials[team][insect] = new MeshLambertMaterial({color: colors[team], map: textures[insect]});
}
export const MATERIALS = materials;