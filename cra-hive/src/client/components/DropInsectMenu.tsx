import { useRef, Suspense, useState } from 'react'
import Team from '../../shared/model/teams'
import Insect from '../../shared/model/insects'
import { Canvas } from '@react-three/fiber'
import { GLTFModel } from '../canvas/GLTFModel'

import { useSpring, animated } from '@react-spring/three'

export function DropInsect( {insect, handleClick, active, team} ) {
    const [hovered, setHover] = useState(false);
    const mesh = useRef<THREE.Mesh>(null!)
    const { rotation, scale } = useSpring({
        rotation: hovered ? [ 0, 0, 0 ] : [ Math.PI / 2 , 0, 0],
        scale: hovered ? 4 : 2
    });
    return (
        <button style={{ position: "relative", width: "50px", height: "50px", borderColor: team === Team.WHITE ? 'red' : 'blue', borderStyle: active ? 'double': 'dashed'}}
            disabled={! active}
            onPointerEnter={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onClick={() => handleClick(insect)}
            >
           <Suspense fallback={<p> {insect} </p>}>
               <Canvas>
                   <ambientLight />
                   <pointLight position={[10, 10, 10]} />

                   <group>
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
    </button>
   )
}

export function DropInsectMenuTeam( { stones, active, handleClick, allowedToDrop=(i)=>true} ) {
    // Get the numbers out
    const counts = {};
    let teamThis;
    for (const {insect, team} of stones) {
        teamThis = team;
        if (counts.hasOwnProperty(insect)) counts[insect]++;
        else counts[insect] = 1;
    }
    return (
        <div>
            <ul style={{display: "flex", flexDirection: "row"}}>
                {Array.from(Object.values(Insect)).map( (insect, i) => {
                    const count = counts[insect];
                    return <li key={insect}> {count || 0} <DropInsect insect={insect}
                    handleClick={handleClick} 
                    active={active && allowedToDrop(insect)}
                    team={teamThis}/> </li>
                })
            }
            </ul>
        </div>
    )
}

export function DropInsectMenu( {stones, team, handleClick=()=>console.log("No click handler given"), allowedToDrop} ) {
    return (
        <div>
            <DropInsectMenuTeam
                active={team === Team.BLACK}
                stones={stones.get(Team.BLACK)}
                handleClick={team === Team.BLACK ? handleClick : () => {}}
                allowedToDrop={allowedToDrop}
                />
            <DropInsectMenuTeam
                active={team === Team.WHITE}
                stones={stones.get(Team.WHITE)}
                handleClick={team === Team.WHITE ? handleClick : () => {}}
                allowedToDrop={allowedToDrop}
                />
        </div>
    )

}
