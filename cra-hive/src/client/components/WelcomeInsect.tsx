import Stone from '../canvas/Stone'
import { Canvas } from '@react-three/fiber'
import * as HEX from '../../shared/hexlib'

export default function WelcomeInsect() {

    return (
        <div style={{ position: "absolute", right: 0, height: '30vw' }}>
            <Canvas camera={{ near: 0.1, far: 100 }} >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Stone
                    hex={HEX.Hex(0, 0)}
                    stone={ {"team": "white", "insect": "bee"}}
                    />
            </Canvas>
        </div>
    )
}
