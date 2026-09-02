(()=>{
'use strict';
const E=window.GridwakeEngine,$=id=>document.getElementById(id),KEY='obg.gridwake.v2';
let mode='bot',boards=[],current=0,last='—',commitments=['',''],nonces=['',''],botRemaining=[],locked=false;
let phase='setup',setupPlayer=0,selectedShipId='',setupDir='h',privacyNext=null;

function fleetFor(size){return size===7?[{id:'atlas',name:'Atlas',length:4},{id:'comet',name:'Comet',length:3},{id:'lance',name:'Lance',length:3},{id:'skiff',name:'Skiff',length:2}]:E.DEFAULT_FLEET}
function freshNonce(){return crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`}
function save(){try{localStorage.setItem(KEY,JSON.stringify({mode,boards,current,last,commitments,nonces,botRemaining,locked,phase,setupPlayer,selectedShipId,setupDir,size:$('size').value,difficulty:$('difficulty').value}))}catch(_e){}}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(!x?.boards?.length||!['setup','play','complete'].includes(x.phase))return false;({mode,boards,current,last,commitments,nonces,botRemaining,locked,phase,setupPlayer,selectedShipId,setupDir}=x);$('mode').value=mode;$('size').value=x.size||10;$('difficulty').value=x.difficulty||'medium';return true}catch(_e){return false}}

async function start(){
  mode=$('mode').value;
  const size=Number($('size').value),fleet=fleetFor(size);
  boards=mode==='bot'?[E.createBoard(size),E.randomFleet(size,fleet,Date.now()+991)]:[E.createBoard(size),E.createBoard(size)];
  current=0;setupPlayer=0;phase='setup';last='Place your fleet';locked=false;commitments=['',''];nonces=['',''];botRemaining=fleet.map(x=>x.length);selectedShipId=fleet[0].id;setupDir='h';
  render();save();
}

function shipAt(board,at){return board.ships.find(s=>s.cells.includes(at))}
function cells(board,showShips,targetMode,setupMode){
  const n=board.size;let html='';
  for(let i=0;i<n*n;i++){
    const vessel=showShips&&shipAt(board,i),shot=board.shots[i];let cls=vessel?' ship':'';
    if(vessel&&setupMode&&vessel.id===selectedShipId)cls+=' selected-ship';
    if(shot===1)cls=' miss';
    if(shot===2){const sh=board.ships.find(s=>s.cells.includes(i));cls=sh&&sh.hits.length===sh.cells.length?' sunk':' hit'}
    if(targetMode&&shot===0)cls+=' target';
    if(setupMode)cls+=' placement';
    html+=`<button class="sea-cell${cls}" data-at="${i}" style="grid-column:${i%n+1};grid-row:${Math.floor(i/n)+1}" aria-label="${String.fromCharCode(65+i%n)}${Math.floor(i/n)+1}">${shot===1?'•':shot===2?'×':''}</button>`;
  }
  return html;
}
function chips(board,hide){return board.ships.map(s=>`<span class="fleet-chip ${s.hits.length===s.cells.length?'sunk':''}">${s.name} · ${s.length}${hide?'':' · '+s.hits.length+'/'+s.length}</span>`).join('')}
function setupPicker(board,fleet){
  $('shipPicker').innerHTML=fleet.map(def=>{const placed=board.ships.some(s=>s.id===def.id);return `<option value="${def.id}"${def.id===selectedShipId?' selected':''}>${def.name} · ${def.length}${placed?' ✓':''}</option>`}).join('');
}
function renderSetup(){
  const board=boards[setupPlayer],fleet=fleetFor(board.size),validation=E.validateFleet(board,fleet);
  if(!fleet.some(x=>x.id===selectedShipId))selectedShipId=fleet[0].id;
  $('setupPanel').hidden=false;$('targetCard').hidden=true;
  $('ownTitle').textContent=mode==='local'?`Player ${setupPlayer+1} waters`:'Your waters';
  $('own').style.gridTemplateColumns=`repeat(${board.size},1fr)`;$('own').innerHTML=cells(board,true,false,true);
  $('own').querySelectorAll('.placement').forEach(b=>b.onclick=()=>placeSelected(Number(b.dataset.at)));
  $('ownFleet').innerHTML=chips(board,false);setupPicker(board,fleet);
  $('setupTitle').textContent=mode==='local'?`Player ${setupPlayer+1}: deploy your fleet`:'Deploy your fleet';
  $('setupHint').textContent=validation.valid?'Fleet ready. Confirm when you are happy with the layout.':'Choose a vessel, set its direction, then tap a starting square.';
  $('rotateShip').textContent=setupDir==='h'?'Horizontal ↔':'Vertical ↕';
  $('removeShip').disabled=!board.ships.some(s=>s.id===selectedShipId);$('confirmFleet').disabled=!validation.valid;
  $('turn').textContent='Deployment';$('shots').textContent='0';$('last').textContent=last;$('commitShort').textContent=commitments[setupPlayer]?(commitments[setupPlayer].slice(0,8)+'…'):'Pending';
  $('commitFull').textContent=`P1 commitment: ${commitments[0]||'pending'} · P2 commitment: ${commitments[1]||'pending'}`;
  $('status').textContent=validation.valid?'All ships placed. You can still move or rotate them before confirming.':`${fleet.length-board.ships.length} ship${fleet.length-board.ships.length===1?'':'s'} left to place.`;
}
function renderPlay(){
  const me=current,opp=1-current,own=boards[me],target=boards[opp];
  $('setupPanel').hidden=true;$('targetCard').hidden=false;$('ownTitle').textContent='Your waters';
  $('own').style.gridTemplateColumns=`repeat(${own.size},1fr)`;$('target').style.gridTemplateColumns=`repeat(${own.size},1fr)`;
  $('own').innerHTML=cells(own,true,false,false);$('target').innerHTML=cells(target,false,!locked,false);
  $('target').querySelectorAll('.target').forEach(b=>b.onclick=()=>fire(Number(b.dataset.at)));
  $('ownFleet').innerHTML=chips(own,false);$('targetFleet').innerHTML=chips(target,true);
  $('turn').textContent=locked?'Complete':`Player ${current+1}${mode==='bot'&&current===1?' · Bot':''}`;
  $('shots').textContent=boards.reduce((n,b)=>n+b.shots.filter(Boolean).length,0);$('last').textContent=last;
  $('commitShort').textContent=(commitments[me]||'').slice(0,8)+'…';$('commitFull').textContent=`P1 commitment: ${commitments[0]||'pending'} · P2 commitment: ${commitments[1]||'pending'}`;
  $('status').textContent=locked?last:(mode==='bot'&&current===1?'Computer is choosing a coordinate…':'Fire on an untried target cell.');
}
function render(){phase==='setup'?renderSetup():renderPlay();save()}

function placeSelected(at){
  if(phase!=='setup')return;
  const board=boards[setupPlayer],fleet=fleetFor(board.size),def=fleet.find(x=>x.id===selectedShipId);if(!def)return;
  const [row,col]=E.rc(board,at);
  try{boards[setupPlayer]=E.placeShip(board,def,row,col,setupDir);last=`${def.name} placed.`;render()}catch(e){last=e.message==='Overlap'?'That position overlaps another ship.':'That ship would extend beyond the board.';$('status').textContent=last;$('last').textContent=last}
}
function rotateSelected(){
  setupDir=setupDir==='h'?'v':'h';
  const board=boards[setupPlayer],def=fleetFor(board.size).find(x=>x.id===selectedShipId),placed=board.ships.find(s=>s.id===selectedShipId);
  if(placed&&def){const [row,col]=E.rc(board,placed.cells[0]);try{boards[setupPlayer]=E.placeShip(board,def,row,col,setupDir);last=`${def.name} rotated.`}catch(_e){setupDir=setupDir==='h'?'v':'h';last='Not enough room to rotate there.'}}
  render();
}
async function commitPlayer(p){nonces[p]=freshNonce();commitments[p]=await E.commitment(boards[p],nonces[p])}
function showPrivacy(text,next){$('privacyText').textContent=text;privacyNext=next;$('privacy').hidden=false;save()}
async function confirmFleet(){
  if(phase!=='setup')return;
  const board=boards[setupPlayer],fleet=fleetFor(board.size);if(!E.validateFleet(board,fleet).valid)return;
  await commitPlayer(setupPlayer);
  if(mode==='bot'){
    if(!commitments[1])await commitPlayer(1);
    phase='play';current=0;last='Fleet locked. Your turn.';render();return;
  }
  if(setupPlayer===0){
    last='Player 1 fleet locked.';showPrivacy('Player 2, take the device. Your board is empty and ready for deployment.',()=>{setupPlayer=1;selectedShipId=fleet[0].id;setupDir='h';last='Place your fleet';render()});return;
  }
  last='Both fleets locked.';showPrivacy('Player 1, take the device. Both fleets are committed and battle can begin.',()=>{phase='play';current=0;last='Player 1 fires first.';render()});
}

function fire(at){if(phase!=='play'||locked||boards[1-current].shots[at]||mode==='bot'&&current===1)return;const p=current,r=E.fire(boards[1-p],at);boards[1-p]=r.board;last=r.win?`Player ${p+1} sinks the final ship.`:r.sunk?`Sunk ${r.sunk}.`:r.hit?'Hit.':'Miss.';if(r.win){locked=true;phase='complete';render();return}current=1-p;if(mode==='local'){showPrivacy(`Player ${current+1}, take the device. The fleets stay hidden until you continue.`,render);render()}else{render();setTimeout(bot,300)}}
function bot(){if(mode!=='bot'||current!==1||locked||phase!=='play')return;const view=boards[0].shots,at=E.botShot(view,boards[0].size,$('difficulty').value,botRemaining);const r=E.fire(boards[0],at);boards[0]=r.board;if(r.sunk){const sh=boards[0].ships.find(s=>s.id===r.sunk),ix=botRemaining.indexOf(sh.length);if(ix>=0)botRemaining.splice(ix,1)}last=r.win?'Computer sinks the final ship.':r.sunk?`Computer sunk ${r.sunk}.`:r.hit?'Computer hit.':'Computer missed.';if(r.win){locked=true;phase='complete'}else current=0;render()}

$('privacyReady').onclick=()=>{const next=privacyNext;privacyNext=null;$('privacy').hidden=true;if(next)next()};
$('shipPicker').onchange=e=>{selectedShipId=e.target.value;render()};
$('rotateShip').onclick=rotateSelected;
$('removeShip').onclick=()=>{if(phase!=='setup')return;boards[setupPlayer]=E.removeShip(boards[setupPlayer],selectedShipId);last='Ship removed.';render()};
$('clearFleet').onclick=()=>{if(phase!=='setup')return;boards[setupPlayer]=E.createBoard(boards[setupPlayer].size);last='Fleet cleared.';render()};
$('randomizeFleet').onclick=()=>{if(phase!=='setup')return;const size=boards[setupPlayer].size;boards[setupPlayer]=E.randomFleet(size,fleetFor(size),Date.now()+setupPlayer*997);last='Fleet randomized. You can still edit it.';render()};
$('confirmFleet').onclick=confirmFleet;
$('newGame').onclick=start;$('mode').onchange=start;$('size').onchange=start;
if(!load())start();else render();
})();
