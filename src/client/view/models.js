import {LoadingManager} from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
export const loadManager = new LoadingManager();

export let models = {};
const gltfLoader = new GLTFLoader(loadManager);

gltfLoader.load('/static/objects/bee/bumblebee.gltf', (gltf) => {
     models["BEE"] = gltf.scene
});
gltfLoader.load('/static/objects/spider/spider.gltf', (gltf) => {
     models["SPIDER"] = gltf.scene
});

gltfLoader.load('/static/objects/grasshopper/grasshopper.gltf', (gltf) => {
     models["GRASSHOPPER"] = gltf.scene
});
gltfLoader.load('/static/objects/ant/ant.gltf', (gltf) => {
     models["ANT"] = gltf.scene
});

gltfLoader.load('/static/objects/beetle/beetle.gltf', (gltf) => {
    models["BEETLE"] = gltf.scene
});
