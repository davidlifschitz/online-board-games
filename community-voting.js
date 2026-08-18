const votingState={
  client:null,
  session:null,
  votedSubmissionIds:new Set(),
  gameTitles:new Map(),
  builds:[]
};

function votingMake(tag,className,text){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
}

function votingLink(label,href){
  const anchor=votingMake('a','community-build-link',label);
  anchor.href=href;
  anchor.target='_blank';
  anchor.rel='noreferrer';
  return anchor;
}

function setVoteMessage(message,type=''){
  const target=document.querySelector('#communityVoteMessage');
  if(!target)return;
  target.textContent=message||'';
  target.classList.remove('error','success');
  if(type)target.classList.add(type);
}

function mountVotingStyles(){
  if(document.querySelector('#communityVotingStyles'))return;
  const style=document.createElement('style');
  style.id='communityVotingStyles';
  style.textContent=`
    .community-vote-block{margin:0 0 26px;padding:22px;border:1px solid var(--line);border-radius:var(--radius);background:linear-gradient(145deg,rgba(21,30,50,.93),rgba(12,18,32,.96))}
    .community-vote-head{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:8px}
    .community-vote-head h3{font-size:clamp(25px,3.2vw,36px);letter-spacing:-.035em;margin:5px 0 0}
    .community-vote-rule{max-width:430px;color:var(--muted);font-size:13px;line-height:1.55;margin:0;text-align:right}
    .community-vote-copy{color:var(--muted);line-height:1.65;margin:0 0 18px;max-width:760px}
    .community-vote-message{min-height:20px;margin:0 0 10px;font-size:13px}
    .community-vote-message.error{color:var(--danger)}
    .community-vote-message.success{color:var(--accent)}
    .community-favorites-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
    .community-build-card{position:relative;display:flex;flex-direction:column;min-height:238px;padding:18px;border:1px solid var(--line);border-radius:18px;background:#0d1423}
    .community-build-card:hover{border-color:#4a5875}
    .community-build-rank{position:absolute;top:15px;right:15px;font-size:11px;letter-spacing:.08em;font-weight:850;color:#7f8daa}
    .community-build-game{display:block;padding-right:42px;font-size:10px;letter-spacing:.11em;text-transform:uppercase;color:var(--accent);font-weight:800}
    .community-build-card h4{font-size:22px;letter-spacing:-.025em;margin:10px 0 5px;padding-right:42px}
    .community-build-byline{color:var(--muted);font-size:13px;margin:0 0 10px}
    .community-build-models{display:flex;gap:5px;flex-wrap:wrap;margin:4px 0 16px}
    .community-build-models span{font-size:10px;padding:5px 7px;border-radius:999px;background:#1d2840;color:#c7d0e6}
    .community-build-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:auto;padding-top:13px;border-top:1px solid var(--line)}
    .community-vote-action{display:flex;align-items:center;gap:8px}
    .community-vote-button{border:1px solid #3b4864;background:#111a2c;color:var(--text);border-radius:999px;padding:8px 11px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}
    .community-vote-button:hover{border-color:#7182aa}
    .community-vote-button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#06130b}
    .community-vote-button:disabled{opacity:.55;cursor:wait}
    .community-vote-score{min-width:24px;font-variant-numeric:tabular-nums;font-size:15px;font-weight:850;color:var(--accent)}
    .community-build-links{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}
    .community-build-link{color:var(--text);font-size:12px;text-decoration:none;font-weight:750}
    .community-build-link:hover{color:var(--accent)}
    .community-vote-empty{grid-column:1/-1;padding:22px;border:1px dashed var(--line);border-radius:16px;color:var(--muted)}
    @media(max-width:900px){.community-favorites-grid{grid-template-columns:1fr}}
    @media(max-width:620px){.community-vote-block{padding:17px}.community-vote-head{align-items:start;flex-direction:column}.community-vote-rule{text-align:left}.community-build-bottom{align-items:flex-start;flex-direction:column}.community-build-links{justify-content:flex-start}}
  `;
  document.head.appendChild(style);
}

function mountVotingUi(){
  if(document.querySelector('#communityFavoritesBlock'))return true;
  const leaderboard=document.querySelector('#leaderboard');
  if(!leaderboard)return false;

  mountVotingStyles();
  const block=votingMake('div','community-vote-block');
  block.id='communityFavoritesBlock';

  const head=votingMake('div','community-vote-head');
  const titleWrap=votingMake('div');
  titleWrap.appendChild(votingMake('p','section-label','COMMUNITY FAVORITES'));
  titleWrap.appendChild(votingMake('h3','', 'Vote for the builds you like most'));
  head.appendChild(titleWrap);
  head.appendChild(votingMake('p','community-vote-rule','One like per signed-in user per build. Builders cannot like their own builds.'));
  block.appendChild(head);
  block.appendChild(votingMake('p','community-vote-copy','Builds are ranked by raw community likes. Sign in with GitHub or Google to vote; voter identities stay private.'));

  const message=votingMake('p','community-vote-message');
  message.id='communityVoteMessage';
  message.setAttribute('role','status');
  message.setAttribute('aria-live','polite');
  block.appendChild(message);

  const grid=votingMake('div','community-favorites-grid');
  grid.id='communityFavorites';
  grid.setAttribute('aria-live','polite');
  grid.appendChild(votingMake('div','community-vote-empty','Loading community favorites…'));
  block.appendChild(grid);

  const boardLayout=leaderboard.querySelector('.board-layout');
  if(boardLayout)boardLayout.before(block);
  else leaderboard.appendChild(block);
  return true;
}

function gameTitleForVote(gameId){
  return votingState.gameTitles.get(gameId)||gameId;
}

function voteButtonText(hasVoted,signedIn){
  if(!signedIn)return '♡ Sign in to vote';
  return hasVoted?'♥ Liked':'♡ Like';
}

function renderCommunityFavorites(){
  if(!mountVotingUi())return;
  const grid=document.querySelector('#communityFavorites');
  if(!grid)return;
  grid.replaceChildren();

  if(!votingState.builds.length){
    grid.appendChild(votingMake('div','community-vote-empty','No approved builds are available for voting yet.'));
    return;
  }

  votingState.builds.forEach((build,index)=>{
    const card=votingMake('article','community-build-card');
    card.appendChild(votingMake('span','community-build-rank',`#${index+1}`));
    card.appendChild(votingMake('span','community-build-game',gameTitleForVote(build.game_id)));
    card.appendChild(votingMake('h4','',build.implementation_name));
    card.appendChild(votingMake('p','community-build-byline',`Built by ${build.builder_display_name} · verified via ${build.identity_provider}`));

    const models=votingMake('div','community-build-models');
    (build.models||[]).forEach(model=>models.appendChild(votingMake('span','',model)));
    card.appendChild(models);

    const bottom=votingMake('div','community-build-bottom');
    const voteAction=votingMake('div','community-vote-action');
    const hasVoted=votingState.votedSubmissionIds.has(build.id);
    const voteButton=votingMake('button','community-vote-button',voteButtonText(hasVoted,Boolean(votingState.session)));
    voteButton.type='button';
    voteButton.dataset.submissionId=build.id;
    voteButton.setAttribute('aria-pressed',hasVoted?'true':'false');
    voteButton.setAttribute('aria-label',`${hasVoted?'Remove like from':'Like'} ${build.implementation_name}`);
    voteButton.addEventListener('click',()=>toggleCommunityVote(build.id,voteButton));
    voteAction.appendChild(voteButton);
    const count=Number(build.vote_count)||0;
    const score=votingMake('span','community-vote-score',String(count));
    score.title=`${count} community ${count===1?'like':'likes'}`;
    voteAction.appendChild(score);
    bottom.appendChild(voteAction);

    const links=votingMake('div','community-build-links');
    links.appendChild(votingLink('Play ↗',build.live_url));
    links.appendChild(votingLink('Source ↗',build.source_url));
    bottom.appendChild(links);
    card.appendChild(bottom);
    grid.appendChild(card);
  });
}

async function loadVotingGameTitles(){
  try{
    const response=await fetch('/games.json',{cache:'no-store'});
    if(!response.ok)return;
    const data=await response.json();
    votingState.gameTitles=new Map((data.games||[]).map(game=>[game.id,game.title]));
  }catch(error){
    console.error('Voting catalog load failed',error);
  }
}

async function loadCommunityBuilds(){
  if(!votingState.client)return;
  const {data,error}=await votingState.client
    .from('builder_submissions')
    .select('id,game_id,implementation_name,live_url,source_url,models,builder_display_name,identity_provider,approved_at,vote_count')
    .eq('status','approved')
    .order('vote_count',{ascending:false})
    .order('approved_at',{ascending:true})
    .order('implementation_name',{ascending:true})
    .limit(100);

  if(error){
    console.error('Community favorites load failed',error);
    setVoteMessage('Community voting could not load. Refresh and try again.','error');
    return;
  }
  votingState.builds=data||[];
}

async function loadOwnVotes(){
  if(!votingState.client||!votingState.session){
    votingState.votedSubmissionIds=new Set();
    return;
  }
  const {data,error}=await votingState.client.from('build_votes').select('submission_id');
  if(error){
    console.error('Vote history load failed',error);
    votingState.votedSubmissionIds=new Set();
    return;
  }
  votingState.votedSubmissionIds=new Set((data||[]).map(row=>row.submission_id));
}

async function refreshVotingBoard(){
  await Promise.all([loadCommunityBuilds(),loadOwnVotes()]);
  renderCommunityFavorites();
}

function normalizeVoteError(error){
  const message=error?.message||'Vote could not be saved.';
  if(message.includes('You cannot vote for your own build'))return 'Builders cannot vote for their own builds.';
  if(message.includes('Only approved builds'))return 'Only approved builds can receive votes.';
  if(error?.code==='23505')return 'You already liked this build.';
  if(error?.code==='42501')return 'Your sign-in session cannot vote right now. Sign out and sign back in.';
  return message;
}

async function toggleCommunityVote(submissionId,button){
  if(!votingState.client)return;
  if(!votingState.session){
    setVoteMessage('Sign in with GitHub or Google to vote.','error');
    document.querySelector('#submit')?.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }

  button.disabled=true;
  const alreadyVoted=votingState.votedSubmissionIds.has(submissionId);
  const request=alreadyVoted
    ? votingState.client.from('build_votes').delete().eq('submission_id',submissionId)
    : votingState.client.from('build_votes').insert({submission_id:submissionId});
  const {error}=await request;

  if(error){
    console.error('Vote update failed',error);
    setVoteMessage(normalizeVoteError(error),'error');
    button.disabled=false;
    return;
  }

  setVoteMessage(alreadyVoted?'Like removed.':'Like counted.','success');
  await refreshVotingBoard();
}

async function syncVotingSession(){
  if(!votingState.client)return;
  const {data,error}=await votingState.client.auth.getSession();
  if(error)console.error('Voting session lookup failed',error);
  votingState.session=data?.session||null;
  await refreshVotingBoard();
}

function getSharedVotingClient(){
  if(window.builderBoardSupabaseClient)return Promise.resolve(window.builderBoardSupabaseClient);

  return new Promise((resolve,reject)=>{
    let settled=false;
    const finish=client=>{
      if(settled)return;
      settled=true;
      window.clearTimeout(timeout);
      window.removeEventListener('builder-board-client-ready',onReady);
      resolve(client);
    };
    const onReady=event=>finish(event.detail?.client||window.builderBoardSupabaseClient);
    const timeout=window.setTimeout(()=>{
      if(settled)return;
      settled=true;
      window.removeEventListener('builder-board-client-ready',onReady);
      reject(new Error('Builder Board Supabase client was not initialized'));
    },10000);
    window.addEventListener('builder-board-client-ready',onReady);
    if(window.builderBoardSupabaseClient)finish(window.builderBoardSupabaseClient);
  });
}

async function initCommunityVoting(){
  if(!mountVotingUi())return;

  votingState.client=await getSharedVotingClient();
  await loadVotingGameTitles();
  const {data,error}=await votingState.client.auth.getSession();
  if(error)console.error('Voting session lookup failed',error);
  votingState.session=data?.session||null;
  await refreshVotingBoard();

  votingState.client.auth.onAuthStateChange((_event,session)=>{
    votingState.session=session;
    window.setTimeout(()=>refreshVotingBoard(),0);
  });

  window.addEventListener('pageshow',()=>syncVotingSession());
}

initCommunityVoting().catch(error=>{
  console.error('Community voting initialization failed',error);
  setVoteMessage('Community voting could not initialize. Refresh and try again.','error');
});
