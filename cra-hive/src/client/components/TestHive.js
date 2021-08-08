import { State } from '../../shared/model/state';

import { useState, useEffect } from 'react';

const Wrapped = () => {
  const [state, setState] = useState(new State());
  const [counter, setCounter] = useState(0);
  const step = () => {
    const newState = state.step()
    setCounter(counter + 1);
  }
  const reset = () => {
    setState(new State());
    setCounter(0);
  }
  return (
    <div>
      <div> Step: {state.turnNumber}</div>
      <button onClick={step}> Make a Step </button>
      <button onClick={reset}> Reset </button>
      <div>
        Stones: {JSON.stringify(state.stones)}
      </div>
      <div>
        Hive: {JSON.stringify(Array.from(state.hive.map.entries()))}
      </div>
    </div>
  )
}

export default function Test() {
  return (
    <Wrapped />
  )
}
