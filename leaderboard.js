const SUPABASE_URL='https://slnvfdkyvijrhmisurhw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_zUTHu9mHMbPfNKIgM_O0Zg_INCN9yF6';
const VOTER_STORAGE_KEY='os-board-games-voter-key';
const $=selector=>document.querySelector(selector);
const state={client:null,catalog:[],games:[],selectedGameId:null,voterKey:null,votedSubmissionIds:new Set()};

function make(tag,className,text){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
}

function link(label,href){
  const a=make('a','rank-link',label);
  a.href=href;
  a.target='_blank';
  a.rel='noreferrer';
  return a;
}

function setMessage(message,type=''){
  const target=$('#leaderboardMessage');
  if(!target)return;
  target.textContent=message||'';
  target.classList.remove('error','success');
  if(type)target.classList.add(type);
}

function getVoterKey(){
  let key=localStorage.getItem(VOTER_STORAGE_KEY);
  if(key)return key;
  key=crypto.randomUUID();
  localStorage.setItem(VOTER_STORAGE_KEY,key);
  return key;
}

async function loadCatalog(){
  try{
    const response=await fetch('/games.json',{cache:'no-store'});
    if(!response.ok)throw new Error(`Catalog returned ${response.status}`);
    const data=await response.json();
    state.catalog=data.games||[];
  }catch(error){
    console.error('Catalog load failed',error);
    state.catalog=[];
  }
}

function gameTitle(gameId){
  return state.catalog.find(game=>game.id===gameId)?.title||gameId;
}

function selectDefaultGame(){
  const requested=new URLSearchParams(location.search).get('game');
  if(requested&&state.games.some(game=>game.game_id===requested))return requested;
  const mostCompetitive=[...state.games].sort((a,b)=>{
    const byCount=Number(b.implementations)-Number(a.implementations);
    if(byCount)return byCount;
    return gameTitle(a.game_id).localeCompare(gameTitle(b.game_id));
  });
  return mostCompetitive[0]?.game_id||null;
}

function renderGamePicker(){
  const select=$('#gameSelect');
  if(!select)return;
  select.replaceChildren();
  const sorted=[...state.games].sort((a,b)=>gameTitle(a.game_id).localeCompare(gameTitle(b.game_id)));
  if(!sorted.length){
    const option=make('option','','No ranked stations yet');
    option.value='';
    select.appendChild(option);
    select.disabled=true;
    return;
  }
  select.disabled=false;
  sorted.forEach(game=>{
    const count=Number(game.implementations)||0;
    const option=make('option','',`${gameTitle(game.game_id)} · ${count} ${count===1?'service':'services'}`);
    option.value=game.game_id;
    select.appendChild(option);
  });
  select.value=state.selectedGameId||'';
}

function renderEmpty(message){
  const body=$('#gameLeaderboardBody');
  if(!body)return;
  body.replaceChildren();
  const row=make('tr','leaderboard-empty-row');
  const cell=make('td','leaderboard-empty',message);
  cell.colSpan=6;
  row.appendChild(cell);
  body.appendChild(row);
}

function formatApprovalDate(value){
  if(!value)return '';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '';
  return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(date);
}

function renderRows(rows){
  const body=$('#gameLeaderboardBody');
  if(!body)return;
  body.replaceChildren();
  const title=gameTitle(state.selectedGameId);
  const summary=$('#selectedGameTitle');
  const meta=$('#gameLeaderboardMeta');
  if(summary)summary.textContent=title;
  if(meta)meta.textContent=`${rows.length} approved ${rows.length===1?'service':'services'} · ranked by community score`;
  if(!rows.length){
    renderEmpty('No approved services for this station yet.');
    return;
  }

  rows.forEach(row=>{
    const tr=make('tr','leaderboard-entry');

    const rankCell=make('td','rank-cell');
    rankCell.appendChild(make('span','rank-number',`#${row.rank}`));
    tr.appendChild(rankCell);

    const buildCell=make('td','submission-cell');
    buildCell.appendChild(make('strong','submission-name',row.implementation_name));
    const approved=formatApprovalDate(row.approved_at);
    if(approved)buildCell.appendChild(make('small','submission-date',`Approved ${approved}`));
    tr.appendChild(buildCell);

    const builderCell=make('td','builder-rank-cell');
    const builderWrap=make('div','rank-builder');
    if(row.builder_avatar_url){
      const img=make('img','rank-avatar');
      img.src=row.builder_avatar_url;
      img.alt='';
      img.loading='lazy';
      builderWrap.appendChild(img);
    }else{
      const initial=(row.builder_display_name||'?').trim().charAt(0).toUpperCase()||'?';
      builderWrap.appendChild(make('span','rank-avatar rank-avatar-fallback',initial));
    }
    const builderCopy=make('div','rank-builder-copy');
    builderCopy.appendChild(make('strong','',row.builder_display_name));
    builderCopy.appendChild(make('small','',`via ${row.identity_provider}`));
    builderWrap.appendChild(builderCopy);
    builderCell.appendChild(builderWrap);
    tr.appendChild(builderCell);

    const modelsCell=make('td','models-rank-cell');
    const chips=make('div','rank-models');
    (row.models||[]).forEach(model=>chips.appendChild(make('span','',model)));
    modelsCell.appendChild(chips);
    tr.appendChild(modelsCell);

    const scoreCell=make('td','score-cell');
    const scoreWrap=make('div','score-wrap');
    const hasVoted=state.votedSubmissionIds.has(row.id);
    const voteButton=make('button','rank-vote-button',hasVoted?'▲':'△');
    voteButton.type='button';
    voteButton.setAttribute('aria-pressed',hasVoted?'true':'false');
    voteButton.setAttribute('aria-label',`${hasVoted?'Remove vote from':'Vote for'} ${row.implementation_name}`);
    voteButton.title=hasVoted?'Remove your vote':'Vote for this service';
    voteButton.addEventListener('click',()=>toggleVote(row.id,voteButton));
    scoreWrap.appendChild(voteButton);
    const scoreCopy=make('div','score-copy');
    scoreCopy.appendChild(make('strong','',String(Number(row.score)||0)));
    scoreCopy.appendChild(make('small','',Number(row.score)===1?'point':'points'));
    scoreWrap.appendChild(scoreCopy);
    scoreCell.appendChild(scoreWrap);
    tr.appendChild(scoreCell);

    const linksCell=make('td','rank-links-cell');
    const links=make('div','rank-links');
    links.appendChild(link('Play ↗',row.live_url));
    links.appendChild(link('Source ↗',row.source_url));
    linksCell.appendChild(links);
    tr.appendChild(linksCell);

    body.appendChild(tr);
  });
}

async function loadLeaderboardGames(){
  const {data,error}=await state.client
    .from('game_implementation_counts')
    .select('game_id,implementations,builders,latest_ship_at')
    .order('implementations',{ascending:false})
    .order('game_id',{ascending:true});
  if(error)throw error;
  state.games=data||[];
  state.selectedGameId=selectDefaultGame();
  renderGamePicker();
  updateGameInUrl(state.selectedGameId);
  $('#rankedGameCount').textContent=String(state.games.length);
}

async function loadOwnVotes(){
  const {data,error}=await state.client.rpc('get_build_votes_for_voter',{voter_key:state.voterKey});
  if(error){
    console.error('Vote history load failed',error);
    state.votedSubmissionIds=new Set();
    return;
  }
  state.votedSubmissionIds=new Set((data||[]).map(row=>row.submission_id));
}

async function loadSelectedGame(){
  if(!state.selectedGameId){
    $('#selectedGameTitle').textContent='No ranked stations yet';
    $('#gameLeaderboardMeta').textContent='Approved community services will appear here.';
    renderEmpty('No approved community services are available yet.');
    return;
  }
  const requestedGame=state.selectedGameId;
  renderEmpty('Loading ranked services…');
  setMessage('');
  const {data,error}=await state.client
    .from('game_leaderboard')
    .select('rank,id,game_id,implementation_name,live_url,source_url,models,builder_display_name,builder_avatar_url,identity_provider,score,approved_at')
    .eq('game_id',requestedGame)
    .order('rank',{ascending:true});
  if(requestedGame!==state.selectedGameId)return;
  if(error){
    console.error('Game leaderboard load failed',error);
    setMessage('This station ranking could not load. Refresh and try again.','error');
    renderEmpty('Rankings unavailable.');
    return;
  }
  renderRows(data||[]);
}

function updateGameInUrl(gameId){
  const url=new URL(location.href);
  if(gameId)url.searchParams.set('game',gameId);
  else url.searchParams.delete('game');
  history.replaceState(null,'',url);
}

async function toggleVote(submissionId,button){
  button.disabled=true;
  const alreadyVoted=state.votedSubmissionIds.has(submissionId);
  const {error}=await state.client.rpc('set_build_vote',{
    target_submission_id:submissionId,
    voter_key:state.voterKey,
    should_vote:!alreadyVoted
  });
  if(error){
    console.error('Vote update failed',error);
    setMessage(error.message||'Vote could not be saved.','error');
    button.disabled=false;
    return;
  }
  if(alreadyVoted)state.votedSubmissionIds.delete(submissionId);
  else state.votedSubmissionIds.add(submissionId);
  setMessage(alreadyVoted?'Vote removed.':'Vote counted.','success');
  await loadSelectedGame();
}

async function loadApprovedBuildCount(){
  const {count,error}=await state.client
    .from('builder_submissions')
    .select('id',{count:'exact',head:true})
    .eq('status','approved');
  if(error)throw error;
  $('#approvedBuildCount').textContent=String(count||0);
}

async function init(){
  state.voterKey=getVoterKey();
  await loadCatalog();
  if(!window.supabase?.createClient)throw new Error('Supabase client failed to load');
  state.client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}});
  await Promise.all([loadLeaderboardGames(),loadOwnVotes(),loadApprovedBuildCount()]);
  await loadSelectedGame();
}

$('#gameSelect')?.addEventListener('change',async event=>{
  state.selectedGameId=event.target.value||null;
  updateGameInUrl(state.selectedGameId);
  await loadSelectedGame();
});

init().catch(error=>{
  console.error('Leaderboard initialization failed',error);
  setMessage('The service rankings could not load. Refresh and try again.','error');
  renderEmpty('Rankings unavailable.');
});
