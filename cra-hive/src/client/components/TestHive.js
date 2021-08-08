import { State } from '../../shared/model/state'

import { useState, useEffect } from 'react'

import ThreeHive from './ThreeHive'

const Wrapped = () => {
  const [state, setState] = useState(new State());
  const [counter, setCounter] = useState(0);
  const step = () => {
    state.step()
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
      <div style={{ width: '1000px', height: '600px', overflow: 'hidden', margin: '0px', padding: '0px' }}>
        <ThreeHive hive={state.hive} />
      </div>
    </div>
  )
}

export default function Test() {
  return (
    <Wrapped />
  )
}
