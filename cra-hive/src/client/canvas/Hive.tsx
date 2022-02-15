import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { TrackballControls } from '@react-three/drei'

import * as HEX from '../../shared/hexlib'

import Stone from './Stone'
import HighlightStone from './HighlightStone'

import { Button, Container } from 'semantic-ui-react'

const Hive = ({ hive, handleClick=()=>console.log("No click handler given"),
                highlighted=[],
                team=null,
                interactive=true,
                canvasHeight="50vw",
                cameraOpts={},
                lookAt=[0, 0, 0]
},) => {
    const [layout, setLayout] = useState(HEX.layoutFlat)
    let stones = [];
    for (const hex of hive.map.keys()) {
        hive.map.get(hex).forEach((stone, height) => {
            stones.push(
                <Stone
                    hex={hex}
                    stone={stone}
                    key={"" + hex.q + hex.r + stone.insect}
                    height={height}
                    layout={layout}
                    handleClick={handleClick} />
            )
        });
    };
    const highlights = [];
    highlighted.forEach(([hex, height]) => {
        highlights.push(<HighlightStone 
        layout={layout}
        hex={hex}
        team={team}
        handleClick={handleClick}
        height={height}/>);
    });

    return (
        <Container style={{ height: canvasHeight}}>
            <Canvas camera={{ near: 0.1, far: 100, ...cameraOpts }}
                    onCreated={(state) => {
                        state.camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
                    }}
            >
                {  interactive ? <TrackballControls /> : null}
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {stones}
                {highlights}
            </Canvas>
            {  interactive ? <Button onClick={() => setLayout(layout === HEX.layoutFlat ? HEX.layoutPointy : HEX.layoutFlat)}> Toggle Layout </Button>: null}

        </Container>
    )
}

export default Hive;
