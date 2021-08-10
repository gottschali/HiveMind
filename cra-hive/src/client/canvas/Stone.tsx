import { Vector3 } from 'three'
import { useRef, useState, Suspense } from 'react'
import { useSpring, animated } from '@react-spring/three'

import Team from '../../shared/model/teams'
import * as HEX from '../../shared/hexlib'
import { modelFactory } from './GLTFModel'

export default function Stone({stone, layout, hex, handleClick, height}) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)

    const { team, insect } = stone;
    const { x, y } = HEX.hex_to_pixel(layout, hex);
    const orientation = layout.orientation;


    const color = team === Team.WHITE ? 'orange' : 'blue';

    const { scale } = useSpring({ scale: hovered ? new Vector3(1, 3, 1) : new Vector3(1, 1, 1) })


    return (
        <Suspense fallback={null}>
            <group
                position={[x, y, height]}
                rotation={[Math.PI / 2, orientation === HEX.layout_flat ? Math.PI / 6 : 0, 0]}
                onClick={() => {handleClick(hex)}}
            >
                <animated.mesh
                    position={[0, -.5, 0]}
                    ref={mesh}
                    scale={scale}
                    onPointerOver={(event) => setHover(true)}
                    onPointerOut={(event) => setHover(false)}
                >
                    <cylinderBufferGeometry args={[1, 1, 0.25, 6]} />
                        <meshStandardMaterial color={color} />
                </animated.mesh>
                {modelFactory(insect)}
            </group>
        </Suspense>
    )
}
