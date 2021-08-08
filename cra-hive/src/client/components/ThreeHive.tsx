import { Vector3 } from 'three'
import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { TrackballControls } from '@react-three/drei'

import * as HEX from '../../shared/hexlib'
import Team from '../../shared/model/teams'

import { modelFactory } from './GLTFModel'

import { useSpring, animated } from '@react-spring/three'


const layout = HEX.Layout(HEX.layout_flat, HEX.Point(1, 1), HEX.Point(0, 0))

function Hexagon(props) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    const { team, insect } = props.stone;
    const { x, y } = HEX.hex_to_pixel(layout, props.hex);


    const color = team === Team.WHITE ? 'orange' : 'blue';

    const { scale } = useSpring({
        duration: 500,
        scale: hovered ? new Vector3(1, 3, 1) : new Vector3(1, 1, 1) })


    return (
        <Suspense fallback={null}>
            <group
                position={[x, y, props.height]}
                rotation={[Math.PI / 2, Math.PI / 6, 0]}
            >
                <animated.mesh
                    position={[0, -.5, 0]}
                    ref={mesh}
                    scale={scale}
                    onClick={(event) => setActive(!active)}
                    onPointerOver={(event) => setHover(true)}
                    onPointerOut={(event) => setHover(false)}
                >
                    <cylinderBufferGeometry args={[1, 1, 0.25, 6]} />
                        <meshStandardMaterial color={active ? 'green' : color} />
                </animated.mesh>
                {modelFactory(insect)}
            </group>
        </Suspense>
    )
}

export default ({ hive }) => {
    let hexagons = [];
    for (const hex of hive.map.keys()) {
        hive.map.get(hex).forEach((stone, height) => {
            hexagons.push(
                <Hexagon hex={hex} stone={stone} height={height} />
            )
        });
    }


    return (
            <Canvas camera={{ near: 0.1, far: 100 }} >
                <TrackballControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {hexagons}
            </Canvas>
    )
}
