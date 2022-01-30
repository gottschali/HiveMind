import Stone from '../canvas/Stone'
import { Canvas } from '@react-three/fiber'
import * as HEX from '../../shared/hexlib'

export default function WelcomeInsect() {

    return (
        <div style={{ position: "relative", height: '50vw' }}>
            <h1> Welcome to HiveMind </h1>
            <Canvas camera={{ near: 0.1, far: 100 }} >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Stone
                    hex={HEX.Hex(0, 0)}
                    stone={ {"team": "white", "insect": "bee"}}
                    height={0}
                    layout={HEX.Layout(HEX.layout_flat, HEX.Point(1, 1), HEX.Point(0, 0))}
                    handleClick={() => {}} />
            </Canvas>
        </div>
    )
}
