import { State } from '../../shared/model/state'

import { useState } from 'react'

import Hive from '../canvas/Hive'

const Wrapped = () => {
  const [state, setState] = useState(new State());
  const [counter, setCounter] = useState(0);
  const [iterationSteps, setIterationSteps] = useState(10);
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
      <div>
        <div> Step: {state.turnNumber}</div>
        <button onClick={step}> Make a Step </button>
        <button onClick={reset}> Reset </button>
        <label>
          How many automove steps:
          <input value={iterationSteps} onChange={e => setIterationSteps(e.target.value)}/>
        </label>
        <button onClick={() => {
          for (let i=0;i<iterationSteps;i++) {
            state.step()
          }
          setCounter(counter + iterationSteps);

        }}> AutoPlay </button>
        <div>
          Stones: {JSON.stringify(state.stones)}
        </div>
      </div>
      <Hive hive={state.hive} highlighted={[]}/>
    </div>
  )
}

export default function Test() {
  return (
    <Wrapped />
  )
}
