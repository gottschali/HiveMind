import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { TrackballControls } from '@react-three/drei'

import * as HEX from '../../shared/hexlib'

import Stone from './Stone'
import HighlightStone from './HighlightStone'

import { Button } from 'semantic-ui-react'

const layoutFlat = HEX.Layout(HEX.layout_flat, HEX.Point(1, 1), HEX.Point(0, 0))
const layoutPointy = HEX.Layout(HEX.layout_pointy, HEX.Point(1, 1), HEX.Point(0, 0))


const Hive = ({ hive, handleClick=()=>console.log("No click handler given"), highlighted=[], team=null, interactive=true }) => {
    const [layout, setLayout] = useState(layoutFlat)
    let stones = [];
    for (const hex of hive.map.keys()) {
        hive.map.get(hex).forEach((stone, height) => {
            stones.push(
                <Stone
                    hex={hex}
                    stone={stone}
                    height={height}
                    layout={layout}
                    handleClick={handleClick} />
            )
        });
    }
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
        <div style={{ position: "relative", height: '50vw' }}>
            <Canvas camera={{ near: 0.1, far: 100 }} >
                {  interactive ? <TrackballControls /> : null}
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {stones}
                {highlights}
            </Canvas>
            <Button onClick={() => setLayout(layout === layoutFlat ? layoutPointy : layoutFlat)}> Toggle Layout </Button>
        </div>
    )
}

export default Hive;
