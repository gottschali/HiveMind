// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models

import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Insect from '../../shared/model/insects'

let models = {};

function GLTFModel({insect}) {
    const gltf = useLoader(GLTFLoader,`/objects/${insect}/${insect === Insect.BEE ? 'bumblebee' : insect}.gltf` );
    models[insect] = gltf;
    const scene = gltf.scene.clone();
    return <primitive object={scene} />
}


export const modelFactory = (insect) => {
    return  <GLTFModel insect={insect} />
}

