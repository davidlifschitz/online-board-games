import {chooseMove} from './ai.js';
self.onmessage=e=>{const {state,level,timeMs}=e.data;self.postMessage({move:chooseMove(state,level,timeMs)});};
