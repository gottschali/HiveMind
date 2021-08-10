// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models

import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Insect from '../../shared/model/insects'

import { animated } from '@react-spring/three'

export function GLTFModel({insect, ...props}) {
    const gltf = useLoader(GLTFLoader,`/objects/${insect}/${insect === Insect.BEE ? 'bumblebee' : insect}.gltf` );
    const scene = gltf.scene.clone();
    return <animated.primitive object={scene} {...props}/>
}


export const modelFactory = (insect, ...props) => {
    return  <GLTFModel insect={insect} {...props} />
}

