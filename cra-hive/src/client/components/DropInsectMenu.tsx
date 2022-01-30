import { useRef, Suspense, useState } from 'react'
import Team from '../../shared/model/teams'
import Insect from '../../shared/model/insects'
import { Canvas } from '@react-three/fiber'
import { GLTFModel } from '../canvas/GLTFModel'

import { Button, Container, Label } from 'semantic-ui-react'

import { useSpring } from '@react-spring/three'

export function DropInsect({ insect, selected }) {
    const mesh = useRef<THREE.Mesh>(null!)
    const { rotation, scale } = useSpring({
        rotation: selected ? [0, 0, 0] : [Math.PI / 2, 0, 0],
        scale: selected ? 4 : 2
    });
    return (
        <Suspense fallback={<p> {insect} </p>} >
            <Canvas >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />

                <group position={[0, 3, 0]}>
                    <mesh ref={mesh} >
                        <boxGeometry args={[4, 4, 1]} />
                        <meshStandardMaterial transparent opacity={0} />
                    </mesh>
                    <GLTFModel
                        scale={scale}
                        insect={insect}
                        rotation={rotation}
                    />
                </group>
            </Canvas>
        </Suspense>
    )
}

export function DropInsectMenuTeam({ stones, active, handleClick, allowedToDrop = (i) => true }) {
    // Get the numbers out
    const [, setSelected] = useState(null);
    const counts = {};
    let teamThis;
    for (const { insect, team } of stones) {
        teamThis = team;
        if (counts.hasOwnProperty(insect)) counts[insect]++;
        else counts[insect] = 1;
    }
    const iconMap = {
        beetle: 'bug',
        bee: 'chess queen',
        spider: 'chess pawn',
        grasshopper: 'chess knight',
        ant: 'chess bishop'
    }
    return (<>
        {Array.from(Object.values(Insect)).map((insect, i) => {
            const count = counts[insect];
            const isActive = active && allowedToDrop(insect)
            const color = teamThis === 'white' ? 'red' : 'blue'
            return (
                        <Button as='div'
                            key={insect}
                            disabled={!isActive}
                            labelPosition='right'
                            onClick={() => {
                                handleClick(insect)
                                setSelected(insect)
                            }}
                        >
                            <Button color={color} icon={iconMap[insect]} />
                            <Label as='a' basic pointing='left'>
                             {count || 0}
                            </Label>
                        </Button>
            )
        })
        }
    </>
    )
}

export function DropInsectMenu({ stones, team, handleClick = () => console.log("No click handler given"), allowedToDrop }) {
    return (
        <Container>
            <Button.Group size='tiny'>
                <DropInsectMenuTeam
                    active={team === Team.BLACK}
                    stones={stones.get(Team.BLACK)}
                    handleClick={team === Team.BLACK ? handleClick : () => { }}
                    allowedToDrop={allowedToDrop}
                />
            </Button.Group>
            <Button.Group size='tiny'>
                <DropInsectMenuTeam
                    active={team === Team.WHITE}
                    stones={stones.get(Team.WHITE)}
                    handleClick={team === Team.WHITE ? handleClick : () => { }}
                    allowedToDrop={allowedToDrop}
                />
            </Button.Group>
        </Container>
    )

}
