import _ from 'lodash'
import {State} from '../shared/model/state.js';
import {Game} from './game.js';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');
  const canvas = document.createElement('canvas');
  const game = new Game(canvas);
  game.init(canvas)
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  const state = new State();
  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = () => {
    state.step();
    game.Paint.drawState(state);
  }
  element.appendChild(btn);

  
  element.appendChild(canvas);

  return element;
}

document.body.appendChild(component());
