const SUPABASE_URL='https://slnvfdkyvijrhmisurhw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_zUTHu9mHMbPfNKIgM_O0Zg_INCN9yF6';
const $=selector=>document.querySelector(selector);
const state={session:null,catalog:[],summary:null};
let supabaseClient=null;

function setMessage(target,message,type=''){
  if(!target)return;
  target.textContent=message||'';
  target.classList.remove('error','success');
  if(type)target.classList.add(type);
}
function displayName(user){
  const meta=user?.user_metadata||{};
  return meta.user_name||meta.preferred_username||meta.full_name||meta.name||user?.email||'Verified builder';
}
function avatarUrl(user){
  const meta=user?.user_metadata||{};
  return meta.avatar_url||meta.picture||'';
}
function providerName(user){return user?.app_metadata?.provider||'verified';}
function parseModels(raw){return [...new Set(raw.split(/[\n,]+/).map(value=>value.trim()).filter(Boolean))];}
function isValidHttpsUrl(value){try{return new URL(value).protocol==='https:';}catch{return false;}}
function isGitHubSource(value){
  try{
    const url=new URL(value);
    const parts=url.pathname.split('/').filter(Boolean);
    return url.protocol==='https:'&&url.hostname.toLowerCase()==='github.com'&&parts.length>=2;
  }catch{return false;}
}
function make(tag,className,text){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
}
function setSubmissionEnabled(enabled){
  const form=$('#submissionForm');
  if(!form)return;
  form.classList.toggle('locked',!enabled);
  form.querySelectorAll('input,select,textarea,button').forEach(control=>{control.disabled=!enabled;});
}
function renderAuth(){
  const signedIn=Boolean(state.session?.user);
  $('#signedOutState')?.classList.toggle('hidden',signedIn);
  $('#signedInState')?.classList.toggle('hidden',!signedIn);
  $('#mySubmissionsBlock')?.classList.toggle('hidden',!signedIn);
  setSubmissionEnabled(signedIn);
  if(!signedIn)return;
  const user=state.session.user;
  $('#userName').textContent=displayName(user);
  $('#userProvider').textContent=`Verified via ${providerName(user)}`;
  const avatar=$('#userAvatar');
  const src=avatarUrl(user);
  if(src){avatar.src=src;avatar.classList.remove('hidden');}
  else{avatar.removeAttribute('src');avatar.classList.add('hidden');}
}
function promptUrl(game){
  return `https://github.com/davidlifschitz/online-board-games/blob/main/${game.prompt}`;
}
function updateChallengeStats(){
  const summary=state.summary||{};
  const promptCount=summary.promptConcepts??state.catalog.length;
  const openCount=summary.promptConceptsAwaitingFirstDeployment??state.catalog.filter(game=>game.status==='unbuilt').length;
  const liveCount=summary.promptConceptsWithLiveImplementations??state.catalog.filter(game=>game.status==='live').length;
  if($('#buildPromptCount'))$('#buildPromptCount').textContent=String(promptCount);
  if($('#buildOpenCount'))$('#buildOpenCount').textContent=String(openCount);
  if($('#buildLiveCount'))$('#buildLiveCount').textContent=String(liveCount);
}
function renderChallengeCatalog(){
  const container=$('#challengeCatalog');
  if(!container)return;
  const helper=window.TrainGamesBuildCatalog;
  if(!helper?.groupChallengeGames||!helper?.claimUrlForGame){
    container.replaceChildren(make('p','challenge-empty','The build challenge helper could not load. Use the full catalog on GitHub to choose a game.'));
    return;
  }
  const grouped=helper.groupChallengeGames(state.catalog);
  const labels={starter:'Starter',intermediate:'Intermediate',advanced:'Advanced'};
  const descriptions={
    starter:'Compact rules or UI; good weekend-sized first builds.',
    intermediate:'More game state, hidden information, bots, or multiplayer flow.',
    advanced:'Larger rules engines, stronger AI, graph logic, or complex multiplayer.'
  };
  container.replaceChildren();
  Object.entries(labels).forEach(([difficulty,label])=>{
    const games=grouped[difficulty]||[];
    const section=make('section','challenge-tier');
    const heading=make('div','challenge-tier-heading');
    const title=make('h3','',label);
    const count=make('span','',`${games.length} awaiting first build`);
    heading.append(title,count);
    section.appendChild(heading);
    if(!games.length){
      section.appendChild(make('div','challenge-empty',`No ${label.toLowerCase()} prompts are waiting for a first deployment right now. Alternate implementations are still welcome.`));
      container.appendChild(section);
      return;
    }
    const grid=make('div','challenge-grid');
    games.forEach(game=>{
      const card=make('article','challenge-card');
      const top=make('div','challenge-card-top');
      top.append(make('span','challenge-card-kicker',label.toUpperCase()),make('span','challenge-card-status','Needs first build'));
      card.appendChild(top);
      card.appendChild(make('strong','',game.title));
      card.appendChild(make('p','',descriptions[difficulty]));
      const actions=make('div','challenge-card-actions');
      const prompt=make('a','','Open prompt ↗');
      prompt.href=promptUrl(game);
      prompt.target='_blank';
      prompt.rel='noreferrer';
      const claim=make('a','','Claim game ↗');
      claim.href=helper.claimUrlForGame(game);
      claim.target='_blank';
      claim.rel='noreferrer';
      actions.append(prompt,claim);
      card.appendChild(actions);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    container.appendChild(section);
  });
}
async function loadCatalog(){
  const select=$('#gameId');
  try{
    const response=await fetch('/games.json',{cache:'no-store'});
    if(!response.ok)throw new Error(`Catalog returned ${response.status}`);
    const data=await response.json();
    state.summary=data.summary||null;
    state.catalog=(data.games||[]).filter(game=>game.prompt).sort((a,b)=>a.title.localeCompare(b.title));
  }catch(error){
    console.error('Catalog load failed',error);
    state.summary=null;
    state.catalog=[
      {id:'boggle-style',title:'Boggle-style',prompt:'prompts/26-boggle-style.md',difficulty:'starter',status:'unbuilt'},
      {id:'love-letter-style',title:'Love-Letter-style',prompt:'prompts/15-love-letter-style.md',difficulty:'starter',status:'unbuilt'}
    ];
  }
  updateChallengeStats();
  renderChallengeCatalog();
  if(!select)return;
  select.replaceChildren();
  const placeholder=make('option','','Choose a game / prompt');
  placeholder.value='';
  select.appendChild(placeholder);
  state.catalog.forEach(game=>{
    const option=make('option','',`${game.title} — ${game.difficulty||'open'}`);
    option.value=game.id;
    select.appendChild(option);
  });
  select.disabled=!state.session;
}
function gameTitle(gameId){return state.catalog.find(game=>game.id===gameId)?.title||gameId;}
function renderMySubmissions(rows){
  const container=$('#mySubmissions');
  container.replaceChildren();
  if(!rows?.length){
    container.appendChild(make('div','empty-state','You have not submitted a build yet.'));
    return;
  }
  rows.forEach(row=>{
    const item=make('div','submission-item');
    const copy=make('div');
    copy.appendChild(make('strong','',row.implementation_name));
    copy.appendChild(make('small','',`${gameTitle(row.game_id)} • ${(row.models||[]).join(', ')}`));
    item.appendChild(copy);
    item.appendChild(make('span',`submission-state ${row.status}`,row.status));
    container.appendChild(item);
  });
}
async function loadMySubmissions(){
  if(!supabaseClient||!state.session)return;
  const {data,error}=await supabaseClient
    .from('builder_submissions')
    .select('id,game_id,implementation_name,models,status,submitted_at')
    .order('submitted_at',{ascending:false});
  if(error){
    console.error('My submissions load failed',error);
    renderMySubmissions([]);
    return;
  }
  renderMySubmissions(data||[]);
}
async function signIn(provider){
  if(!supabaseClient)return;
  setMessage($('#authMessage'),'');
  sessionStorage.setItem('builderBoardReturnToSubmit','1');
  const redirectTo=`${window.location.origin}/`;
  const {error}=await supabaseClient.auth.signInWithOAuth({provider,options:{redirectTo}});
  if(error){
    sessionStorage.removeItem('builderBoardReturnToSubmit');
    setMessage($('#authMessage'),error.message,'error');
  }
}
async function handleSubmit(event){
  event.preventDefault();
  const message=$('#submissionMessage');
  setMessage(message,'');
  if(!supabaseClient||!state.session){
    setMessage(message,'Sign in with GitHub or Google before submitting.','error');
    return;
  }
  const gameId=$('#gameId').value;
  const implementationName=$('#implementationName').value.trim();
  const models=parseModels($('#models').value);
  const liveUrl=$('#liveUrl').value.trim();
  const sourceUrl=$('#sourceUrl').value.trim();
  const notes=$('#notes').value.trim();
  const confirmed=$('#confirmOpenSource').checked;

  if(!gameId||!implementationName){setMessage(message,'Choose a game and give the implementation a name.','error');return;}
  if(models.length<1||models.length>12){setMessage(message,'List between 1 and 12 models, separated by commas.','error');return;}
  if(!isValidHttpsUrl(liveUrl)){setMessage(message,'Use a valid HTTPS production URL.','error');return;}
  if(!isGitHubSource(sourceUrl)){setMessage(message,'Source must be a public GitHub repository URL.','error');return;}
  if(!confirmed){setMessage(message,'Confirm the source/permission statement before submitting.','error');return;}

  const button=$('#submitBuild');
  button.disabled=true;
  button.textContent='Submitting…';
  const {error}=await supabaseClient.from('builder_submissions').insert({
    game_id:gameId,
    implementation_name:implementationName,
    live_url:liveUrl,
    source_url:sourceUrl,
    models,
    notes:notes||null
  });
  button.disabled=false;
  button.textContent='Submit for review';

  if(error){
    console.error('Submission failed',error);
    const duplicate=error.code==='23505';
    setMessage(message,duplicate?'That GitHub source has already been submitted for this game.':error.message,'error');
    return;
  }

  event.currentTarget.reset();
  setMessage(message,'Submitted. Your build is pending review and will enter the leaderboard once approved.','success');
  await loadMySubmissions();
}
async function init(){
  await loadCatalog();
  if(!window.supabase?.createClient){
    setMessage($('#authMessage'),'Authentication library failed to load. Refresh and try again.','error');
    return;
  }
  supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  const {data,error}=await supabaseClient.auth.getSession();
  if(error)console.error('Session lookup failed',error);
  state.session=data?.session||null;
  renderAuth();
  await loadCatalog();
  if(state.session)await loadMySubmissions();

  const authError=sessionStorage.getItem('builderBoardAuthError');
  if(authError){
    sessionStorage.removeItem('builderBoardAuthError');
    setMessage($('#authMessage'),authError,'error');
  }

  supabaseClient.auth.onAuthStateChange((_event,session)=>{
    state.session=session;
    renderAuth();
    window.setTimeout(async()=>{
      await loadCatalog();
      if(session)await loadMySubmissions();
    },0);
  });
}
$('#githubLogin')?.addEventListener('click',()=>signIn('github'));
$('#googleLogin')?.addEventListener('click',()=>signIn('google'));
$('#signOut')?.addEventListener('click',async()=>{
  if(!supabaseClient)return;
  await supabaseClient.auth.signOut();
  state.session=null;
  renderAuth();
  $('#mySubmissions')?.replaceChildren();
});
$('#submissionForm')?.addEventListener('submit',handleSubmit);
init().catch(error=>{
  console.error('Build page initialization failed',error);
  setMessage($('#authMessage'),'The submission flow could not initialize. Refresh and try again.','error');
});
