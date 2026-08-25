const DB_NAME='os-photo-puzzle';
const DB_VERSION=1;
const IMAGE_STORE='images';
const STATE_KEY='photo-puzzle:state:v1';
const PIECE_COUNTS=[12,24,40,60,96];
const COMPLEXITY={
  relaxed:{guide:.34,hint:false},
  classic:{guide:.12,hint:false},
  challenge:{guide:0,hint:false}
};

const $=selector=>document.querySelector(selector);
const els={
  setup:$('#setup-card'),game:$('#game-shell'),input:$('#photo-input'),upload:$('#upload-zone'),preview:$('#setup-preview'),start:$('#start-button'),complexity:$('#complexity'),
  board:$('#board'),boardStage:$('#board-stage'),boardGuide:$('#board-guide'),boardScroller:$('#board-scroller'),tray:$('#piece-tray'),progress:$('#progress-text'),timer:$('#timer-text'),
  reference:$('#reference-dialog'),referenceImage:$('#reference-image'),complete:$('#complete-dialog'),completeSummary:$('#complete-summary'),failed:$('#failed-dialog'),check:$('#check-puzzle-button'),guideToggle:$('#guide-toggle'),zoomLabel:$('#zoom-label'),
  mobileSelection:$('#mobile-selection'),selectionThumb:$('#selection-thumb'),piecesBadge:$('#pieces-left-badge'),toast:$('#toast')
};

const state={
  file:null,imageUrl:'',imageId:'current',imageWidth:0,imageHeight:0,pieceCount:24,complexity:'classic',rows:4,cols:6,seed:0,placed:new Set(),placements:new Map(),selected:null,filter:'edges',zoom:1,startedAt:null,elapsedBefore:0,timerId:null,edges:null,order:[],failedChecks:0
};

function openDb(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(IMAGE_STORE))db.createObjectStore(IMAGE_STORE)};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}
async function saveImage(blob){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(IMAGE_STORE,'readwrite');tx.objectStore(IMAGE_STORE).put(blob,state.imageId);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
async function loadImage(){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(IMAGE_STORE,'readonly');const request=tx.objectStore(IMAGE_STORE).get(state.imageId);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error)})}
async function clearImage(){const db=await openDb();return new Promise(resolve=>{const tx=db.transaction(IMAGE_STORE,'readwrite');tx.objectStore(IMAGE_STORE).delete(state.imageId);tx.oncomplete=resolve;tx.onerror=resolve})}

function hashString(value){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function shuffled(items,seed){const arr=[...items],rand=mulberry32(seed);for(let i=arr.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function chooseGrid(count,aspect){let best=null;for(let r=2;r<=Math.sqrt(count);r++){if(count%r)continue;const c=count/r;for(const [rows,cols] of [[r,c],[c,r]]){const ratio=cols/rows;const score=Math.abs(Math.log(ratio/aspect));if(!best||score<best.score)best={rows,cols,score}}}return best||{rows:Math.round(Math.sqrt(count)),cols:Math.round(Math.sqrt(count)),score:0}}
function pieceId(row,col){return`${row}-${col}`}
function parseId(id){const [row,col]=id.split('-').map(Number);return{row,col}}
function isEdge(row,col){return row===0||col===0||row===state.rows-1||col===state.cols-1}

function generateEdges(rows,cols,seed){
  const rand=mulberry32(seed);const map=Array.from({length:rows},()=>Array.from({length:cols},()=>({top:0,right:0,bottom:0,left:0})));
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    if(c<cols-1){const v=rand()>.5?1:-1;map[r][c].right=v;map[r][c+1].left=-v}
    if(r<rows-1){const v=rand()>.5?1:-1;map[r][c].bottom=v;map[r+1][c].top=-v}
  }
  return map;
}

function piecePath(edge){
  const top=edge.top===0?'h 100':`h 30 c 8 0 8 ${14*edge.top} 18 ${14*edge.top} c 10 0 10 ${-14*edge.top} 22 ${-14*edge.top} h 30`;
  const right=edge.right===0?'v 100':`v 30 c 0 8 ${14*edge.right} 8 ${14*edge.right} 18 c 0 10 ${-14*edge.right} 10 ${-14*edge.right} 22 v 30`;
  const bottom=edge.bottom===0?'h -100':`h -30 c -8 0 -8 ${-14*edge.bottom} -18 ${-14*edge.bottom} c -10 0 -10 ${14*edge.bottom} -22 ${14*edge.bottom} h -30`;
  const left=edge.left===0?'v -100':`v -30 c 0 -8 ${-14*edge.left} -8 ${-14*edge.left} -18 c 0 -10 ${14*edge.left} -10 ${14*edge.left} -22 v -30`;
  return`M 0 0 ${top} ${right} ${bottom} ${left} Z`;
}
function svgForPiece(row,col,extraClass=''){
  const id=`clip-${row}-${col}-${Math.random().toString(36).slice(2,8)}`;
  const d=piecePath(state.edges[row][col]);
  const href=escapeAttribute(state.imageUrl);
  const x=-col*100,y=-row*100,w=state.cols*100,h=state.rows*100;
  return`<svg class="${extraClass}" viewBox="-18 -18 136 136" aria-hidden="true"><defs><clipPath id="${id}" clipPathUnits="userSpaceOnUse"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></g><path d="${d}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>`;
}
function escapeAttribute(value){return String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}

function setUploadedBlob(blob){
  if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);
  state.file=blob;state.imageUrl=URL.createObjectURL(blob);
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>{state.imageWidth=img.naturalWidth;state.imageHeight=img.naturalHeight;els.preview.src=state.imageUrl;els.preview.hidden=false;els.upload.classList.add('has-photo');els.start.disabled=false;resolve()};
    img.onerror=reject;img.src=state.imageUrl;
  });
}

async function handlePhoto(file){
  if(!file||!file.type.startsWith('image/')){showToast('Choose an image file.');return}
  if(file.size>25*1024*1024){showToast('Use an image under 25 MB.');return}
  await setUploadedBlob(file);
  try{await saveImage(file)}catch{showToast('Photo loaded. Resume storage is unavailable in this browser.')}
  saveState(false);
}

function startPuzzle({resume=false}={}){
  if(!state.imageUrl)return;
  if(!resume){
    const aspect=state.imageWidth/state.imageHeight||1;const grid=chooseGrid(state.pieceCount,aspect);state.rows=grid.rows;state.cols=grid.cols;state.seed=(Date.now()^hashString(`${state.imageWidth}x${state.imageHeight}`))>>>0;state.placed=new Set();state.placements=new Map();state.selected=null;state.filter='edges';state.elapsedBefore=0;state.startedAt=Date.now();state.failedChecks=0;
  }else state.startedAt=Date.now();
  state.edges=generateEdges(state.rows,state.cols,state.seed);
  const ids=[];for(let r=0;r<state.rows;r++)for(let c=0;c<state.cols;c++)ids.push(pieceId(r,c));
  state.order=shuffled(ids,state.seed^0x9e3779b9);
  els.setup.hidden=true;els.game.hidden=false;els.referenceImage.src=state.imageUrl;renderBoard();renderTray();applyGuide();applyZoom();updateProgress();switchMobileView('board');startTimer();saveState(true);
}

function renderBoard(){
  els.board.replaceChildren();els.board.style.gridTemplateColumns=`repeat(${state.cols},1fr)`;els.board.style.gridTemplateRows=`repeat(${state.rows},1fr)`;els.boardGuide.style.backgroundImage=`url("${escapeCssUrl(state.imageUrl)}")`;
  els.boardStage.style.aspectRatio=`${state.cols}/${state.rows}`;
  for(let r=0;r<state.rows;r++)for(let c=0;c<state.cols;c++){
    const id=pieceId(r,c);const slot=document.createElement('button');slot.type='button';slot.className='slot';slot.dataset.pieceId=id;slot.dataset.row=r;slot.dataset.col=c;slot.setAttribute('role','gridcell');slot.setAttribute('aria-label',`Puzzle position row ${r+1}, column ${c+1}`);
    slot.addEventListener('click',()=>attemptPlace(id));slot.addEventListener('dragover',event=>{event.preventDefault();slot.classList.add('target-hint')});slot.addEventListener('dragleave',()=>slot.classList.remove('target-hint'));slot.addEventListener('drop',event=>{event.preventDefault();slot.classList.remove('target-hint');const dragged=event.dataTransfer.getData('text/plain');if(dragged)selectPiece(dragged,false);attemptPlace(id)});
    const occupant=state.placements.get(id);if(occupant)fillSlot(slot,occupant);els.board.appendChild(slot);
  }
}
function fillSlot(slot,piece){const {row,col}=parseId(piece);slot.classList.add('locked');slot.dataset.occupant=piece;slot.setAttribute('aria-label',`${slot.getAttribute('aria-label')}. Occupied; tap to move this piece.`);const holder=document.createElement('div');holder.className='placed-piece';holder.innerHTML=svgForPiece(row,col);slot.appendChild(holder)}

function visiblePieceIds(){return state.order.filter(id=>{if(state.placed.has(id))return false;const {row,col}=parseId(id);return state.filter==='all'||isEdge(row,col)})}
function renderTray(){
  els.tray.replaceChildren();const ids=visiblePieceIds();
  if(!ids.length){const empty=document.createElement('p');empty.className='tray-empty';empty.textContent=state.filter==='edges'?'Edge pieces placed. Switching to all pieces…':'No loose pieces.';els.tray.appendChild(empty);if(state.filter==='edges'&&!remainingEdges().length)setTimeout(()=>setPieceFilter('all',true),350);return}
  ids.forEach(id=>{const {row,col}=parseId(id);const button=document.createElement('button');button.type='button';button.className='piece-button';button.dataset.pieceId=id;button.draggable=true;button.setAttribute('aria-label',isEdge(row,col)?'Edge puzzle piece':'Puzzle piece');button.innerHTML=svgForPiece(row,col);if(isEdge(row,col)){const badge=document.createElement('span');badge.className='edge-badge';badge.textContent='EDGE';button.appendChild(badge)}if(state.selected===id)button.classList.add('selected');button.addEventListener('click',()=>selectPiece(id,true));button.addEventListener('dragstart',event=>{selectPiece(id,false);event.dataTransfer.setData('text/plain',id);event.dataTransfer.effectAllowed='move'});els.tray.appendChild(button)});
  updateSelectedPreview();
}
function selectPiece(id,autoBoard){if(state.placed.has(id))return;state.selected=id;document.querySelectorAll('.piece-button').forEach(button=>button.classList.toggle('selected',button.dataset.pieceId===id));updateSelectedPreview();highlightRelaxedTarget();if(autoBoard&&matchMedia('(max-width:900px)').matches)switchMobileView('board')}
function updateSelectedPreview(){
  if(!state.selected){els.mobileSelection.classList.remove('show');els.mobileSelection.hidden=true;els.selectionThumb.innerHTML='';return}
  const {row,col}=parseId(state.selected);els.selectionThumb.innerHTML=svgForPiece(row,col);els.mobileSelection.hidden=false;els.mobileSelection.classList.add('show');
}
function highlightRelaxedTarget(){document.querySelectorAll('.slot').forEach(slot=>slot.classList.remove('target-hint'));if(!state.selected||!COMPLEXITY[state.complexity].hint)return;els.board.querySelector(`[data-piece-id="${CSS.escape(state.selected)}"]`)?.classList.add('target-hint')}
function attemptPlace(slotId){
  const occupant=state.placements.get(slotId)||null;
  if(!state.selected){
    if(!occupant)return;
    state.placements.delete(slotId);state.placed.delete(occupant);state.selected=occupant;renderBoard();renderTray();updateProgress();highlightRelaxedTarget();saveState(true);return;
  }
  const id=state.selected;state.placements.set(slotId,id);state.placed.add(id);state.selected=null;
  if(occupant&&occupant!==id){state.placed.delete(occupant);state.selected=occupant}
  renderBoard();renderTray();updateProgress();highlightRelaxedTarget();saveState(true);
  if(state.filter==='edges'&&!remainingEdges().length&&state.placed.size<state.pieceCount){setPieceFilter('all',true);showToast('All edge pieces are on the board. Now use all pieces.')}
}
function remainingEdges(){return state.order.filter(id=>{const {row,col}=parseId(id);return isEdge(row,col)&&!state.placed.has(id)})}
function setPieceFilter(filter,quiet=false){state.filter=filter;document.querySelectorAll('[data-piece-filter]').forEach(button=>button.classList.toggle('active',button.dataset.pieceFilter===filter));renderTray();if(!quiet&&matchMedia('(max-width:900px)').matches)switchMobileView('pieces')}

function guideOpacity(){return COMPLEXITY[state.complexity]?.guide??.12}
function applyGuide(){const available=guideOpacity()>0;const on=available&&els.guideToggle.getAttribute('aria-pressed')!=='false';els.boardGuide.style.opacity=on?String(guideOpacity()):'0';els.guideToggle.disabled=!available;els.guideToggle.textContent=available?(on?'Photo guide on':'Photo guide off'):'No photo guide';highlightRelaxedTarget()}
function applyZoom(){els.boardStage.style.transform=`scale(${state.zoom})`;els.zoomLabel.textContent=`${Math.round(state.zoom*100)}%`}
function changeZoom(delta){state.zoom=Math.min(1.75,Math.max(.75,Math.round((state.zoom+delta)*4)/4));applyZoom()}
function escapeCssUrl(value){return String(value).replaceAll('"','\\"').replaceAll('\\','\\\\')}

function updateProgress(){const remaining=state.pieceCount-state.placed.size;els.progress.textContent=`${state.placed.size} / ${state.pieceCount} placed`;els.piecesBadge.textContent=remaining?`· ${remaining}`:'';if(els.check){els.check.disabled=state.placements.size!==state.pieceCount;els.check.title=els.check.disabled?'Fill every spot before checking the puzzle.':'Check this arrangement.'}}
function elapsedMs(){return state.elapsedBefore+(state.startedAt?Date.now()-state.startedAt:0)}
function formatTime(ms){const total=Math.floor(ms/1000),minutes=Math.floor(total/60),seconds=total%60;return`${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`}
function startTimer(){clearInterval(state.timerId);els.timer.textContent=formatTime(elapsedMs());state.timerId=setInterval(()=>{els.timer.textContent=formatTime(elapsedMs())},1000)}
function checkPuzzle(){
  if(state.placements.size!==state.pieceCount)return;
  const solved=[...state.placements].every(([slotId,piece])=>slotId===piece);
  if(solved){finishPuzzle();return}
  state.failedChecks+=1;saveState(true);els.failed?.showModal();
}
function finishPuzzle(){state.elapsedBefore=elapsedMs();state.startedAt=null;clearInterval(state.timerId);saveState(true,true);const checks=state.failedChecks?` after ${state.failedChecks} failed ${state.failedChecks===1?'check':'checks'}`:'';els.completeSummary.textContent=`${state.pieceCount} pieces in ${formatTime(state.elapsedBefore)}${checks}.`;setTimeout(()=>els.complete.showModal(),250)}

function switchMobileView(view){document.querySelectorAll('[data-mobile-view]').forEach(panel=>panel.classList.toggle('active',panel.datasetMobileView===view));document.querySelectorAll('[data-view]').forEach(button=>{const active=button.dataset.view===view;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))})}
function showToast(message){els.toast.textContent=message;els.toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>els.toast.classList.remove('show'),1600)}

function saveState(active,complete=false){
  try{localStorage.setItem(STATE_KEY,JSON.stringify({active,complete,pieceCount:state.pieceCount,complexity:state.complexity,rows:state.rows,cols:state.cols,seed:state.seed,placed:[...state.placed],placements:[...state.placements],failedChecks:state.failedChecks,filter:state.filter,elapsed:complete?state.elapsedBefore:elapsedMs(),imageWidth:state.imageWidth,imageHeight:state.imageHeight}))}catch{}
}
async function restore(){
  let saved=null;try{saved=JSON.parse(localStorage.getItem(STATE_KEY)||'null')}catch{}
  if(!saved)return;
  const blob=await loadImage().catch(()=>null);if(!blob)return;
  await setUploadedBlob(blob);
  state.pieceCount=PIECE_COUNTS.includes(saved.pieceCount)?saved.pieceCount:24;state.complexity=COMPLEXITY[saved.complexity]?saved.complexity:'classic';state.rows=saved.rows||4;state.cols=saved.cols||6;state.seed=saved.seed||hashString('restored');state.placements=Array.isArray(saved.placements)?new Map(saved.placements):new Map((saved.placed||[]).map(id=>[id,id]));state.placed=new Set([...state.placements.values()]);state.failedChecks=Number(saved.failedChecks)||0;state.filter=saved.filter==='all'?'all':'edges';state.elapsedBefore=Number(saved.elapsed)||0;
  document.querySelectorAll('[data-count]').forEach(button=>button.classList.toggle('active',Number(button.dataset.count)===state.pieceCount));els.complexity.value=state.complexity;
  if(saved.active&&!saved.complete)startPuzzle({resume:true});
}
async function resetToSetup(){clearInterval(state.timerId);state.startedAt=null;state.elapsedBefore=0;state.placed=new Set();state.placements=new Map();state.selected=null;state.failedChecks=0;els.complete.open&&els.complete.close();els.failed?.open&&els.failed.close();els.game.hidden=true;els.setup.hidden=false;window.scrollTo({top:0,behavior:'smooth'});saveState(false)}
async function newPhoto(){await resetToSetup();await clearImage().catch(()=>{});if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);state.imageUrl='';state.file=null;state.imageWidth=0;state.imageHeight=0;els.preview.hidden=true;els.preview.removeAttribute('src');els.upload.classList.remove('has-photo');els.input.value='';els.start.disabled=true;localStorage.removeItem(STATE_KEY)}
function reshuffle(){els.complete.open&&els.complete.close();els.failed?.open&&els.failed.close();state.seed=(state.seed+0x9e3779b9)>>>0;state.placed=new Set();state.placements=new Map();state.selected=null;state.filter='edges';state.elapsedBefore=0;state.startedAt=Date.now();state.failedChecks=0;startPuzzle({resume:true})}

els.input.addEventListener('change',event=>handlePhoto(event.target.files?.[0]).catch(()=>showToast('That photo could not be opened.')));
document.querySelectorAll('[data-count]').forEach(button=>button.addEventListener('click',()=>{state.pieceCount=Number(button.dataset.count);document.querySelectorAll('[data-count]').forEach(item=>item.classList.toggle('active',item===button));saveState(false)}));
els.complexity.addEventListener('change',()=>{state.complexity=els.complexity.value;saveState(false)});
els.start.addEventListener('click',()=>startPuzzle());
document.querySelectorAll('[data-piece-filter]').forEach(button=>button.addEventListener('click',()=>setPieceFilter(button.dataset.pieceFilter)));
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>switchMobileView(button.dataset.view)));
$('#zoom-in').addEventListener('click',()=>changeZoom(.25));$('#zoom-out').addEventListener('click',()=>changeZoom(-.25));
els.guideToggle.addEventListener('click',()=>{els.guideToggle.setAttribute('aria-pressed',String(els.guideToggle.getAttribute('aria-pressed')==='false'));applyGuide()});
$('#reference-button').addEventListener('click',()=>els.reference.showModal());$('#restart-button').addEventListener('click',resetToSetup);els.check?.addEventListener('click',checkPuzzle);$('#back-to-pieces').addEventListener('click',()=>switchMobileView('pieces'));$('#play-again-button').addEventListener('click',reshuffle);$('#new-photo-button').addEventListener('click',newPhoto);
window.addEventListener('beforeunload',()=>{if(!els.game.hidden&&state.startedAt)saveState(true)});
window.addEventListener('resize',()=>{if(!matchMedia('(max-width:900px)').matches)document.querySelectorAll('.mobile-view').forEach(panel=>panel.classList.add('active'))});
restore().catch(()=>{});