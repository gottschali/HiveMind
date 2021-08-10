import { useRef, useState, Suspense } from 'react'

import Team from '../../shared/model/teams'
import * as HEX from '../../shared/hexlib'

export default function HighlightStone({ layout, hex, team, height, handleClick }) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)

    const { x, y } = HEX.hex_to_pixel(layout, hex);
    const orientation = layout.orientation;
    const color = team === Team.WHITE ? 'orange' : 'blue';
    return (
                <mesh
                    position={[x, y, height]}
                    rotation={[Math.PI / 2, orientation === HEX.layout_flat ? Math.PI / 6 : 0, 0]}
                    onClick={() => {handleClick(hex)}}
                    ref={mesh}
                    onPointerOver={(event) => setHover(true)}
                    onPointerOut={(event) => setHover(false)}
                >
                    <cylinderBufferGeometry args={[1, 1, 0.25, 6]} />
                        <meshStandardMaterial color={color} transparent opacity={hovered ? 0.5 : 0.3}/>
                </mesh>
    )
}
