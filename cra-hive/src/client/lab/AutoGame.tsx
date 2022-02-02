import Hive from '../canvas/Hive'
import useHiveGame from "../game/useHiveGame";
import React, { useState, useEffect } from 'react';

export default function AutoGame() {
    const {state, apply} = useHiveGame();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const submitAction = (action) => {
            console.log(`Submitting ${action}`)
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
  }, [isActive, seconds, state, submitAction]);

    return <div>
      <div className="time">
        {seconds}s

        <button onClick={() => setIsActive(!isActive)}>{(isActive ? "Pause" : "Continue")}</button>
      </div>
      <Hive
        hive={state.hive}
        interactive={false}
        team={state.team} />
    </div>
}
