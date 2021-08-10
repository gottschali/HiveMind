import { Vector3 } from 'three'
import { useRef, Suspense, useState } from 'react'
import Team from '../../shared/model/teams'
import Insect from '../../shared/model/insects'
import { Canvas } from '@react-three/fiber'
import { GLTFModel } from '../canvas/GLTFModel'

import { useSpring, animated } from '@react-spring/three'

export function DropInsect( {insect} ) {
    const [hovered, setHover] = useState(false);
    const mesh = useRef<THREE.Mesh>(null!)
    const { rotation, scale } = useSpring({
        rotation: hovered ? [ 0, 0, 0 ] : [ Math.PI / 2 , 0, 0],
        scale: hovered ? 4 : 2
    });
    return (
       <div style={{ position: "relative", width: "10", height: "10" }} >
           <Suspense fallback={<p> {insect} </p>}>
               <Canvas>
                   <ambientLight />
                   <pointLight position={[10, 10, 10]} />

                   <group
                        onPointerOver={(event) => setHover(true)}
                        onPointerOut={(event) => setHover(false)}>
    <mesh ref={mesh} >
        <boxGeometry args={[4, 4, 1]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
                       <GLTFModel
                           scale={scale}
                           insect={insect}
                        onClick={(event) => console.log("Clicked model")}
                            rotation={rotation}
                       />
                   </group>
               </Canvas>
           </Suspense>
       </div>
   )
}

export function DropInsectMenuTeam( {stones, active} ) {
    // Get the numbers out
    const counts = {};
    for (const {insect} of stones) {
        if (counts.hasOwnProperty(insect)) counts[insect]++;
        else counts[insect] = 1;
    }
    return (
        <div>
            <ul style={{float: "left", display: "block"}}>
                {Array.from(Object.values(Insect)).map( (insect, i) => {
                    console.log(insect)
                    return <li> <h3>{counts[insect] || 0}</h3> : <DropInsect insect={insect} /> </li>
                })
            }
            </ul>
        </div>
    )
}

export function DropInsectMenu( {stones, team} ) {
    return (
        <div>
            <DropInsectMenuTeam
                active={team === Team.WHITE}
                stones={stones.get(Team.WHITE)}/>
            <DropInsectMenuTeam
                active={team === Team.BLACK}
                stones={stones.get(Team.BLACK)}/>
        </div>
    )

}
