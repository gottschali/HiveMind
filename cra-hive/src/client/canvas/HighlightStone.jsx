import { useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/three'

import Team from '../../shared/model/teams'
import * as HEX from '../../shared/hexlib'

export default function HighlightStone({ layout, hex, team, height, handleClick=()=>console.log("no Click handler given") }) {
    const mesh = useRef(null)
    const [hovered, setHover] = useState(false)
    const { opacity } = useSpring({opacity: hovered ? 0.9 : 0.3})
    const { x, y } = HEX.hex_to_pixel(layout, hex);
    const orientation = layout.orientation;
    const color = team === Team.WHITE ? 'red' : 'blue';
    return (
                <mesh
                    position={[x, y, height - .5]}
                    rotation={[Math.PI / 2, orientation === HEX.orientation_flat ? Math.PI / 6 : 0, 0]}
                    onPointerDown={() => {handleClick(hex)}}
                    ref={mesh}
                    onPointerOver={(event) => setHover(true)}
                    onPointerOut={(event) => setHover(false)}
                >
                    <cylinderBufferGeometry args={[1, 1, 0.25, 6]} />
                        <animated.meshStandardMaterial color={color} transparent opacity={opacity}/>
                </mesh>
    )
}
