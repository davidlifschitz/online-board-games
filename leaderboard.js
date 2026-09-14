const SUPABASE_URL='https://slnvfdkyvijrhmisurhw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_zUTHu9mHMbPfNKIgM_O0Zg_INCN9yF6';
const siteRoot=new URL('./',document.currentScript?.src||location.href);
const VOTER_STORAGE_KEY='os-board-games-voter-key';
const $=selector=>document.querySelector(selector);
const state={client:null,catalog:[],games:[],selectedGameId:null,groupMode:'station',voterKey:null,votedSubmissionIds:new Set()};

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

function messageTarget(){
  return state.groupMode==='contributor'?'#contributorMessage':'#leaderboardMessage';
}

function setMessage(message,type=''){
  const target=$(messageTarget());
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
    const response=await fetch(new URL('games.json',siteRoot),{cache:'no-store'});
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

function groupModeFromUrl(){
  const searchParams=new URLSearchParams(location.search);
  return searchParams.get('group')==='contributor'?'contributor':'station';
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

function renderContributorEmpty(message){
  const board=$('#contributorLeaderboard');
  if(!board)return;
  board.replaceChildren(make('div','leaderboard-empty',message));
}

function formatApprovalDate(value){
  if(!value)return '';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '';
  return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(date);
}

function appendBuilderAvatar(parent,group){
  if(group.builder_avatar_url){
    const img=make('img','rank-avatar');
    img.src=group.builder_avatar_url;
    img.alt='';
    img.loading='lazy';
    parent.appendChild(img);
    return;
  }
  const initial=(group.builder_display_name||'?').trim().charAt(0).toUpperCase()||'?';
  parent.appendChild(make('span','rank-avatar rank-avatar-fallback',initial));
}

function createVoteControl(row){
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
  return scoreWrap;
}

function createModelChips(models){
  const chips=make('div','rank-models');
  (models||[]).forEach(model=>chips.appendChild(make('span','',model)));
  return chips;
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
    appendBuilderAvatar(builderWrap,row);
    const builderCopy=make('div','rank-builder-copy');
    builderCopy.appendChild(make('strong','',row.builder_display_name));
    builderCopy.appendChild(make('small','',`via ${row.identity_provider}`));
    builderWrap.appendChild(builderCopy);
    builderCell.appendChild(builderWrap);
    tr.appendChild(builderCell);

    const modelsCell=make('td','models-rank-cell');
    modelsCell.appendChild(createModelChips(row.models));
    tr.appendChild(modelsCell);

    const scoreCell=make('td','score-cell');
    scoreCell.appendChild(createVoteControl(row));
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

function groupRowsByContributor(rows){
  const groupsByBuilder=new Map();
  rows.forEach(row=>{
    let group=groupsByBuilder.get(row.builder_key);
    if(!group){
      group={
        builder_key:row.builder_key,
        builder_display_name:row.builder_display_name,
        builder_avatar_url:row.builder_avatar_url,
        identity_provider:row.identity_provider,
        rows:[],
        total_score:0
      };
      groupsByBuilder.set(row.builder_key,group);
    }
    group.rows.push(row);
    group.total_score+=Number(row.score)||0;
  });

  const groups=[...groupsByBuilder.values()];
  groups.forEach(group=>group.rows.sort((a,b)=>{
    const byGame=gameTitle(a.game_id).localeCompare(gameTitle(b.game_id));
    if(byGame)return byGame;
    const byScore=(Number(b.score)||0)-(Number(a.score)||0);
    if(byScore)return byScore;
    const aDate=a.approved_at?new Date(a.approved_at).getTime():Number.MAX_SAFE_INTEGER;
    const bDate=b.approved_at?new Date(b.approved_at).getTime():Number.MAX_SAFE_INTEGER;
    if(aDate!==bDate)return aDate-bDate;
    return a.implementation_name.localeCompare(b.implementation_name);
  }));
  groups.sort((a,b)=>{
    const byName=(a.builder_display_name||'').localeCompare(b.builder_display_name||'',undefined,{sensitivity:'base'});
    if(byName)return byName;
    return a.builder_key.localeCompare(b.builder_key);
  });
  return groups;
}

function labeledCell(label,className){
  const cell=make('div',className);
  cell.dataset.label=label;
  return cell;
}

function renderContributorGroups(rows){
  const board=$('#contributorLeaderboard');
  if(!board)return;
  board.replaceChildren();
  const groups=groupRowsByContributor(rows);
  const meta=$('#contributorLeaderboardMeta');
  if(meta)meta.textContent=`${groups.length} ${groups.length===1?'contributor':'contributors'} · ${rows.length} approved ${rows.length===1?'service':'services'}`;
  if(!groups.length){
    renderContributorEmpty('No approved contributor services are available yet.');
    return;
  }

  groups.forEach(group=>{
    const section=make('section','contributor-group');
    const heading=make('div','contributor-group-heading');
    const builder=make('div','rank-builder contributor-builder');
    appendBuilderAvatar(builder,group);
    const copy=make('div','rank-builder-copy');
    copy.appendChild(make('strong','',group.builder_display_name));
    copy.appendChild(make('small','',`via ${group.identity_provider}`));
    builder.appendChild(copy);
    heading.appendChild(builder);

    const stats=make('div','contributor-group-stats');
    const serviceStat=make('span','');
    serviceStat.appendChild(make('strong','',String(group.rows.length)));
    serviceStat.appendChild(make('small','',group.rows.length===1?'service':'services'));
    stats.appendChild(serviceStat);
    const scoreStat=make('span','');
    scoreStat.appendChild(make('strong','',String(group.total_score)));
    scoreStat.appendChild(make('small','',group.total_score===1?'point':'points'));
    stats.appendChild(scoreStat);
    heading.appendChild(stats);
    section.appendChild(heading);

    const header=make('div','contributor-service-header');
    ['Station','Service','Models','Score','Links'].forEach(label=>header.appendChild(make('span','',label)));
    section.appendChild(header);

    group.rows.forEach(row=>{
      const serviceRow=make('div','contributor-service-row');

      const stationCell=labeledCell('Station','contributor-station');
      stationCell.appendChild(make('strong','',gameTitle(row.game_id)));
      serviceRow.appendChild(stationCell);

      const serviceCell=labeledCell('Service','contributor-service');
      serviceCell.appendChild(make('strong','submission-name',row.implementation_name));
      const approved=formatApprovalDate(row.approved_at);
      if(approved)serviceCell.appendChild(make('small','submission-date',`Approved ${approved}`));
      serviceRow.appendChild(serviceCell);

      const modelCell=labeledCell('Models','contributor-models');
      modelCell.appendChild(createModelChips(row.models));
      serviceRow.appendChild(modelCell);

      const scoreCell=labeledCell('Score','contributor-score');
      scoreCell.appendChild(createVoteControl(row));
      serviceRow.appendChild(scoreCell);

      const linksCell=labeledCell('Links','contributor-links');
      const links=make('div','rank-links');
      links.appendChild(link('Play ↗',row.live_url));
      links.appendChild(link('Source ↗',row.source_url));
      linksCell.appendChild(links);
      serviceRow.appendChild(linksCell);

      section.appendChild(serviceRow);
    });

    board.appendChild(section);
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

async function loadContributorGroups(){
  renderContributorEmpty('Loading contributors…');
  setMessage('');
  const {data,error}=await state.client
    .from('builder_submissions')
    .select('id,builder_key,game_id,implementation_name,live_url,source_url,models,builder_display_name,builder_avatar_url,identity_provider,vote_count,approved_at')
    .eq('status','approved')
    .order('approved_at',{ascending:false});
  if(error){
    console.error('Contributor ranking load failed',error);
    setMessage('Contributor rankings could not load. Refresh and try again.','error');
    renderContributorEmpty('Contributor rankings unavailable.');
    return;
  }
  renderContributorGroups((data||[]).map(row=>({...row,score:Number(row.vote_count)||0})));
}

async function loadCurrentView(){
  if(state.groupMode==='contributor')await loadContributorGroups();
  else await loadSelectedGame();
}

function updateGameInUrl(gameId){
  const url=new URL(location.href);
  if(gameId)url.searchParams.set('game',gameId);
  else url.searchParams.delete('game');
  history.replaceState(null,'',url);
}

function updateGroupInUrl(mode){
  const url=new URL(location.href);
  const searchParams=url.searchParams;
  if(mode==='contributor')searchParams.set('group','contributor');
  else searchParams.delete('group');
  history.replaceState(null,'',url);
}

function applyGroupMode({syncUrl=true}={}){
  const contributor=state.groupMode==='contributor';
  const stationView=$('#stationRankingView');
  const contributorView=$('#contributorRankingView');
  if(stationView)stationView.hidden=contributor;
  if(contributorView)contributorView.hidden=!contributor;
  document.querySelectorAll('[data-group-mode]').forEach(button=>{
    const active=button.dataset.groupMode===state.groupMode;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',active?'true':'false');
  });
  if(syncUrl)updateGroupInUrl(state.groupMode);
}

async function setGroupMode(mode,{syncUrl=true}={}){
  state.groupMode=mode==='contributor'?'contributor':'station';
  applyGroupMode({syncUrl});
  await loadCurrentView();
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
  await loadCurrentView();
}

async function init(){
  if(!window.supabase?.createClient)throw new Error('Supabase library failed to load');
  state.client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
  });
  state.voterKey=getVoterKey();
  state.groupMode=groupModeFromUrl();
  await Promise.all([loadCatalog(),loadOwnVotes()]);
  await loadLeaderboardGames();
  applyGroupMode({syncUrl:false});
  const {count,error:countError}=await state.client
    .from('builder_submissions')
    .select('id',{count:'exact',head:true})
    .eq('status','approved');
  if(!countError&&typeof count==='number')$('#approvedBuildCount').textContent=String(count);
  await loadCurrentView();

  $('#gameSelect').addEventListener('change',async event=>{
    state.selectedGameId=event.target.value||null;
    updateGameInUrl(state.selectedGameId);
    if(state.groupMode==='station')await loadSelectedGame();
  });
  document.querySelectorAll('[data-group-mode]').forEach(button=>button.addEventListener('click',async()=>{
    if(button.dataset.groupMode===state.groupMode)return;
    await setGroupMode(button.dataset.groupMode);
  }));
  window.addEventListener('popstate',async()=>{
    state.groupMode=groupModeFromUrl();
    const requested=new URLSearchParams(location.search).get('game');
    if(requested&&state.games.some(game=>game.game_id===requested)){
      state.selectedGameId=requested;
      $('#gameSelect').value=requested;
    }
    applyGroupMode({syncUrl:false});
    await loadCurrentView();
  });
}

init().catch(error=>{
  console.error('Leaderboard initialization failed',error);
  setMessage('The service rankings could not load. Refresh and try again.','error');
  if(state.groupMode==='contributor')renderContributorEmpty('Rankings unavailable.');
  else renderEmpty('Rankings unavailable.');
});