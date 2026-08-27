(()=>{'use strict';
const FAMILIES=Object.freeze({
  board:['crown-jump','racehome','gridwake','tilebound','boxline','sowstone','millstone','hexline','fourfront','frontiers'],
  cards:['huebreak','high-table','hearts','spades','gin-rummy','rummy-500','twenty-one-lab','five-dice'],
  action:['deal-room','threadmark','spark-six'],
  puzzle:['photo-puzzle','mergefront','cipherloom']
});
const TITLES={
  'deal-room':'Deal Room','photo-puzzle':'Photo Puzzle',huebreak:'HueBreak',threadmark:'Threadmark',fourfront:'Fourfront','crown-jump':'Crown Jump',racehome:'Racehome',gridwake:'Gridwake',frontiers:'Frontiers','five-dice':'Five Dice',tilebound:'Tilebound','high-table':'High Table',hearts:'Hearts',spades:'Spades','gin-rummy':'Gin Rummy','rummy-500':'Rummy 500','twenty-one-lab':'Twenty-One Lab',mergefront:'Mergefront',boxline:'Boxline',sowstone:'Sowstone',millstone:'Millstone',hexline:'Hexline',cipherloom:'Cipherloom','spark-six':'Spark Six'
};
const body=document.body,slug=body.dataset.v2Game;
if(!slug)return;
const family=body.dataset.v2Family||Object.entries(FAMILIES).find(([,games])=>games.includes(slug))?.[0];
if(!family)return;
body.classList.add('tg2-game',`tg2-${family}`,`tg2-${slug}`);
body.dataset.version='v2';
document.documentElement.classList.add('tg2-enhanced');
const bar=document.querySelector('[data-v2-switch]');
if(bar){
  const title=bar.querySelector('.tg2-game-title');
  if(title&&!title.textContent.trim())title.textContent=TITLES[slug]||slug;
  const tools=document.createElement('div');tools.className='tg2-tools';
  tools.innerHTML='<button type="button" class="tg2-tool tg2-settings-toggle" hidden aria-expanded="false">Settings</button><button type="button" class="tg2-tool tg2-rules-toggle" hidden aria-expanded="false">Rules</button><button type="button" class="tg2-tool tg2-restart" hidden>New</button>';
  bar.append(tools);
}
let controls=null,rules=null,restart=null;
function first(sel){return document.querySelector(sel)}
function annotate(){
  const nextControls=first('.controls,.toolbar:not(.game-toolbar),.setup-controls,.settings');
  if(nextControls&&slug!=='photo-puzzle'){
    controls=nextControls;controls.classList.add('tg2-settings-panel');
    const b=first('.tg2-settings-toggle');if(b){b.hidden=false;b.setAttribute('aria-controls','tg2-settings-panel');controls.id=controls.id||'tg2-settings-panel'}
  }
  const nextRules=first('.help,.rules-panel');
  if(nextRules){rules=nextRules;rules.classList.add('tg2-rules-panel');const b=first('.tg2-rules-toggle');if(b){b.hidden=false;rules.id=rules.id||'tg2-rules-panel';b.setAttribute('aria-controls',rules.id)}}
  restart=first('#newGame,#new,#restart-button,#playAgain,[data-new-game]');
  const rb=first('.tg2-restart');if(rb)rb.hidden=!restart;
  document.querySelectorAll('.statusbar,.scorebar,.scoreboard,.turnbar,.status-row,.game-toolbar').forEach(x=>x.classList.add('tg2-hud'));
  document.querySelectorAll('.game-grid,.game-panel,.board-wrap,.boardbox,.bg-panel,.fleet-panel,.hex-panel,.board-panel,.trainer,.table').forEach(x=>x.classList.add('tg2-stage'));
  document.querySelectorAll('.actions,.action-row,.complete-actions,.toolbar-actions').forEach(x=>x.classList.add('tg2-actions'));
  document.querySelectorAll('.hand,.piece-tray,.dice').forEach(x=>x.classList.add('tg2-interaction-rail'));
}
function toggle(kind){
  const klass=`tg2-${kind}-open`,button=first(`.tg2-${kind}-toggle`);
  const on=!body.classList.contains(klass);
  body.classList.toggle(klass,on);
  if(kind==='settings')body.classList.remove('tg2-rules-open');else body.classList.remove('tg2-settings-open');
  button?.setAttribute('aria-expanded',String(on));
}
document.addEventListener('click',e=>{
  if(e.target.closest('.tg2-settings-toggle'))toggle('settings');
  if(e.target.closest('.tg2-rules-toggle'))toggle('rules');
  if(e.target.closest('.tg2-restart')&&restart)restart.click();
  if(e.target.closest('.tg2-settings-panel button,.tg2-rules-panel a')){body.classList.remove('tg2-settings-open','tg2-rules-open')}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')body.classList.remove('tg2-settings-open','tg2-rules-open')});
const changed=new WeakSet();
function observeState(){
  document.querySelectorAll('#status,#turn,#phase,#score,#message,#feedback,.status,.statusbar strong,.scorebar strong,.turnbar strong').forEach(node=>{
    if(changed.has(node))return;changed.add(node);let timer;
    new MutationObserver(()=>{node.classList.remove('tg2-state-pulse');void node.offsetWidth;node.classList.add('tg2-state-pulse');clearTimeout(timer);timer=setTimeout(()=>node.classList.remove('tg2-state-pulse'),360)}).observe(node,{childList:true,subtree:true,characterData:true});
  });
}
let raf=0;const refresh=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{annotate();observeState()})};
new MutationObserver(refresh).observe(body,{childList:true,subtree:true});
annotate();observeState();
window.addEventListener('traingames:v2-ready',refresh);
})();
