import test from 'node:test';
import assert from 'node:assert/strict';
import {createInitialState,generateLegalMoves,applyMove,status,positionKey,RED_SIDE,BLACK_SIDE,RED_KING,BLACK_KING} from '../engine.js';
import {chooseMove} from '../ai.js';

test('repeated playable positions do not end the game',()=>{
  const state=createInitialState();
  const key=positionKey(state);
  state.positionCounts[key]=7;
  assert.equal(status(state).over,false);
  assert.ok(generateLegalMoves(state).length>0);
});

test('only an actual terminal position produces a winner',()=>{
  const board=Array(64).fill(0);board[1]=BLACK_KING;board[56]=RED_KING;
  const live={board,turn:RED_SIDE,ply:0,history:[],lastMove:null,positionCounts:{}};
  live.positionCounts[positionKey(live)]=10;
  assert.equal(status(live).over,false);
  const trapped={...live,board:Array(64).fill(0),turn:RED_SIDE};trapped.board[0]=RED_KING;trapped.board[9]=BLACK_KING;trapped.board[18]=BLACK_KING;trapped.positionCounts={};
  const st=status(trapped);assert.equal(st.over,true);assert.equal(st.winner,BLACK_SIDE);
});

test('medium AI avoids a previously repeated continuation when a fresh alternative exists',()=>{
  const state=createInitialState(BLACK_SIDE);
  const moves=generateLegalMoves(state);
  assert.ok(moves.length>1);
  const repeatedNext=applyMove(state,moves[0]);
  state.positionCounts[positionKey(repeatedNext)]=8;
  const picked=chooseMove(state,'medium',1200);
  const pickedNext=applyMove(state,picked);
  assert.notEqual(positionKey(pickedNext),positionKey(repeatedNext));
});
