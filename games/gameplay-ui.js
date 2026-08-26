(()=>{'use strict';
const PROFILES=Object.freeze({
  board:['crown-jump','boxline','sowstone','millstone','discshift','hexline','gridwake','racehome','tilebound'],
  cards:['high-table','hearts','spades','gin-rummy','rummy-500'],
  action:['spark-six','twenty-one-lab','deal-room'],
  puzzle:['mergefront','cipherloom','photo-puzzle']
});
const match=location.pathname.match(/\/games\/([^/]+)/);
const slug=match?.[1];
const profile=Object.entries(PROFILES).find(([,games])=>games.includes(slug))?.[0];
if(!slug||!profile)return;

function text(el,value){if(el&&el.textContent.trim()===value[0])el.textContent=value[1]}
function settingsSnapshot(root){
  const bits=[];
  root.querySelectorAll('select').forEach(select=>{if(bits.length>=2)return;const label=select.closest('label')?.childNodes?.[0]?.textContent?.trim();const selected=select.selectedOptions?.[0]?.textContent?.trim();if(label&&selected)bits.push(`${label}: ${selected}`)});
  if(bits.length<2)root.querySelectorAll('input[type="checkbox"]:checked').forEach(input=>{if(bits.length>=2)return;const label=input.closest('label')?.textContent?.replace(/\s+/g,' ').trim();if(label)bits.push(label)});
  return bits.join(' · ')||'Mode, difficulty and rules';
}
function enhanceSettings(){
  if(slug==='photo-puzzle')return;
  const controls=document.querySelector('.controls,.toolbar:not(.game-toolbar)');
  if(!controls||controls.closest('.tg-settings'))return;
  const details=document.createElement('details');
  details.className='tg-settings';
  const summary=document.createElement('summary');
  summary.innerHTML='<span class="tg-settings-label"><span class="tg-settings-icon" aria-hidden="true">⚙</span><strong>Game settings</strong></span><span class="tg-settings-value"></span>';
  controls.parentNode.insertBefore(details,controls);
  details.append(summary,controls);
  const value=summary.querySelector('.tg-settings-value');
  const update=()=>{value.textContent=settingsSnapshot(controls)};
  controls.addEventListener('change',update);
  update();
}
function annotate(){
  document.body.classList.add('tg-game',`tg-${profile}`);
  document.body.dataset.tgGame=slug;
  document.documentElement.classList.add('tg-enhanced');
  document.querySelectorAll('nav span').forEach(el=>{text(el,['OS Online Board Games','TrainGames']);text(el,['OS Board Games','TrainGames'])});
  document.querySelectorAll('.statusbar,.scorebar,.scoreboard').forEach(el=>el.classList.add('tg-state'));
  const surface=document.querySelector('.game-panel,.game-grid,.board-wrap,.fleet-panel,.bg-panel,.trainer,.game-shell');
  surface?.classList.add('tg-play-surface');
  document.querySelectorAll('.actions').forEach(el=>el.classList.add('tg-action-dock'));
  document.querySelectorAll('.help,.history-panel').forEach(el=>el.classList.add('tg-secondary'));
  const stateNodes=document.querySelectorAll('.status,[role="status"],.statusbar strong,.scorebar strong,#turnTitle,#message,#feedback');
  stateNodes.forEach(node=>{
    let timer;
    new MutationObserver(()=>{
      node.classList.remove('tg-state-changed');
      void node.offsetWidth;
      node.classList.add('tg-state-changed');
      clearTimeout(timer);
      timer=setTimeout(()=>node.classList.remove('tg-state-changed'),420);
    }).observe(node,{childList:true,subtree:true,characterData:true});
  });
}
function enhance(){enhanceSettings();annotate()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();
})();
