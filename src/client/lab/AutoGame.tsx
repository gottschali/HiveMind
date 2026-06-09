import useHiveGame from "../game/useHiveGame";
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'
import {layoutFlat} from '../../shared/hexlib'
import Stone from '../canvas/Stone'

const Hive = ({ hive, handleClick=()=>console.log("No click handler given"), highlighted=[], team=null, interactive=true }) => {
    const [layout,] = useState(layoutFlat)
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
    return (
        <div style={{ position: "relative", height: '50vw' }}>
            <Canvas camera={{ near: 0.1, far: 100 }} >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {stones}
            </Canvas>
        </div>
    )
}

export default function AutoGame() {
    const {state, apply} = useHiveGame();

  const [seconds, setSeconds] = useState(0);
  const [isActive, ] = useState(true);

  const submitAction = (action) => {
            if (state.isLegal(action)) {
                apply(action);
                return true;
            }
            return false;
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
        const action = state.actions[Math.floor(Math.random() * state.actions.length)];
        submitAction(action);
      }, 100);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  });

    return <Hive
             hive={state.hive}
             interactive={false}
             team={state.team} />
}
