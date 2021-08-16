import { useRef, useState, Suspense } from 'react'
import { useSpring, animated } from '@react-spring/three'

import * as HEX from '../../shared/hexlib'
import { GLTFModel } from './GLTFModel'
import Team from '../../shared/model/teams'

export default function Stone({stone, layout, hex, handleClick, height}) {
    const teamColor = stone.team === Team.WHITE ? 'red' : 'blue';
    const mesh = useRef(null);
    const [hovered, setHover] = useState(false)
    const { x, y } = HEX.hex_to_pixel(layout, hex);
    const orientation = layout.orientation;

    const spring = useSpring({
        color: hovered ? 'grey' : teamColor,
        rotation: hovered ? [0, Math.PI, 0] : [0, 0, 0]
    });

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
                    onPointerOver={(event) => setHover(true)}
                    onPointerOut={(event) => setHover(false)}
                >
                    <cylinderBufferGeometry args={[1, 1, 0.25, 6]} />
                        <animated.meshStandardMaterial color={spring.color} />
                </animated.mesh>
                <GLTFModel insect={stone.insect} rotation={spring.rotation} />
            </group>
        </Suspense>
    )
}
