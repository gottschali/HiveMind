// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models

import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Insect from '../../shared/model/insects'

import { animated } from '@react-spring/three'

let models = {};

export function GLTFModel({insect, ...props}) {
    const gltf = useLoader(GLTFLoader,`/objects/${insect}/${insect === Insect.BEE ? 'bumblebee' : insect}.gltf` );
    models[insect] = gltf;
    const scene = gltf.scene.clone();
    return <animated.primitive object={scene} {...props}/>
}


export const modelFactory = (insect) => {
    return  <GLTFModel insect={insect} />
}

