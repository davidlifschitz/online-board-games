const filters=[...document.querySelectorAll('.filter')];
const cards=[...document.querySelectorAll('.game-card')];
filters.forEach(button=>button.addEventListener('click',()=>{
  filters.forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  const filter=button.dataset.filter;
  cards.forEach(card=>card.classList.toggle('hidden',filter!=='all'&&!card.dataset.tags.split(' ').includes(filter)));
}));

const SUPABASE_URL='https://slnvfdkyvijrhmisurhw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_zUTHu9mHMbPfNKIgM_O0Zg_INCN9yF6';

const $=selector=>document.querySelector(selector);
const state={session:null,catalog:[]};

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

function providerName(user){
  return user?.app_metadata?.provider||'verified';
}

function parseModels(raw){
  return [...new Set(raw.split(/[\n,]+/).map(value=>value.trim()).filter(Boolean))];
}

function isValidHttpsUrl(value){
  try{
    const url=new URL(value);
    return url.protocol==='https:';
  }catch{return false;}
}

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

function link(label,href){
  const a=make('a','',label);
  a.href=href;
  a.target='_blank';
  a.rel='noreferrer';
  return a;
}

function setSubmissionEnabled(enabled){
  const form=$('#submissionForm');
  if(!form)return;
  form.classList.toggle('locked',!enabled);
  form.querySelectorAll('input,select,textarea,button').forEach(control=>{
    control.disabled=!enabled;
  });
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
  if(src){
    avatar.src=src;
    avatar.classList.remove('hidden');
  }else{
    avatar.removeAttribute('src');
    avatar.classList.add('hidden');
  }
}

async function loadCatalog(){
  const select=$('#gameId');
  try{
    const response=await fetch('/games.json',{cache:'no-store'});
    if(!response.ok)throw new Error(`Catalog returned ${response.status}`);
    const data=await response.json();
    state.catalog=(data.games||[]).filter(game=>game.prompt).sort((a,b)=>a.title.localeCompare(b.title));
  }catch(error){
    console.error('Catalog load failed',error);
    state.catalog=[
      {id:'mancala',title:'Mancala',difficulty:'starter'},
      {id:'dots-and-boxes',title:'Dots and Boxes',difficulty:'starter'},
      {id:'mastermind',title:'Mastermind-style',difficulty:'starter'},
      {id:'farkle',title:'Farkle',difficulty:'starter'},
      {id:'boggle-style',title:'Boggle-style',difficulty:'starter'},
      {id:'love-letter-style',title:'Love-Letter-style',difficulty:'starter'}
    ];
  }

  if(!select)return;
  select.replaceChildren();
  const placeholder=make('option','', 'Choose a game / prompt');
  placeholder.value='';
  select.appendChild(placeholder);
  state.catalog.forEach(game=>{
    const option=make('option','',`${game.title} — ${game.difficulty||'open'}`);
    option.value=game.id;
    select.appendChild(option);
  });
  select.disabled=!state.session;
}

function renderBoard(rows){
  const container=$('#builderBoard');
  if(!container)return;
  container.replaceChildren();
  if(!rows?.length){
    container.appendChild(make('div','empty-state','No approved community builds yet. Submit the first one.'));
    return;
  }

  rows.forEach((row,index)=>{
    const item=make('div','board-row');
    const builder=make('div','builder-cell');
    const initial=(row.builder_display_name||'').trim().charAt(0).toUpperCase()||String(index+1);
    builder.appendChild(make('div','builder-avatar-fallback',initial));
    const copy=make('div','builder-copy');
    copy.appendChild(make('strong','',row.builder_display_name));
    copy.appendChild(make('small','',`Verified via ${row.identity_provider}`));
    builder.appendChild(copy);
    item.appendChild(builder);
    item.appendChild(make('div','board-number',String(row.games_shipped)));
    item.appendChild(make('div','board-number',String(row.first_implementations)));
    item.appendChild(make('div','board-number',String(row.distinct_game_concepts)));
    container.appendChild(item);
  });
}

function renderModels(rows){
  const container=$('#modelUsage');
  if(!container)return;
  container.replaceChildren();
  if(!rows?.length){
    container.appendChild(make('div','empty-state','Model data appears after the first approved build.'));
    return;
  }
  rows.slice(0,10).forEach(row=>{
    const item=make('div','model-item');
    item.appendChild(make('span','',row.model));
    item.appendChild(make('strong','',String(row.implementations)));
    container.appendChild(item);
  });
}

function gameTitle(gameId){
  return state.catalog.find(game=>game.id===gameId)?.title||gameId;
}

function renderRecent(rows){
  const container=$('#recentBuilds');
  const meta=$('#recentBuildMeta');
  if(!container)return;
  container.replaceChildren();
  if(meta)meta.textContent=rows?.length?`${rows.length} latest`:'';
  if(!rows?.length){
    container.appendChild(make('div','empty-state wide','No approved community builds yet. The first accepted submission will appear here.'));
    return;
  }
  rows.forEach(row=>{
    const card=make('article','recent-card');
    const top=make('div','recent-top');
    top.appendChild(make('span','recent-game',gameTitle(row.game_id)));
    top.appendChild(make('span','verified',`via ${row.identity_provider}`));
    card.appendChild(top);
    card.appendChild(make('h4','',row.implementation_name));
    card.appendChild(make('p','',`Built by ${row.builder_display_name}`));
    const chips=make('div','model-chips');
    (row.models||[]).forEach(model=>chips.appendChild(make('span','',model)));
    card.appendChild(chips);
    const links=make('div','recent-links');
    links.appendChild(link('Play ↗',row.live_url));
    links.appendChild(link('Source ↗',row.source_url));
    card.appendChild(links);
    container.appendChild(card);
  });
}

function renderMySubmissions(rows){
  const container=$('#mySubmissions');
  if(!container)return;
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

let supabaseClient=null;

async function loadPublicData(){
  if(!supabaseClient)return;
  const [boardResult,modelResult,recentResult,countResult]=await Promise.all([
    supabaseClient.from('builder_leaderboard').select('*').order('games_shipped',{ascending:false}).order('first_implementations',{ascending:false}).order('latest_ship_at',{ascending:true}),
    supabaseClient.from('model_usage').select('*').order('implementations',{ascending:false}).order('model',{ascending:true}),
    supabaseClient.from('builder_submissions').select('game_id,implementation_name,live_url,source_url,models,builder_display_name,identity_provider,approved_at').eq('status','approved').order('approved_at',{ascending:false}).limit(9),
    supabaseClient.from('builder_submissions').select('id',{count:'exact',head:true}).eq('status','approved')
  ]);

  if(boardResult.error)console.error('Builder Board load failed',boardResult.error);
  if(modelResult.error)console.error('Model usage load failed',modelResult.error);
  if(recentResult.error)console.error('Recent builds load failed',recentResult.error);

  renderBoard(boardResult.data||[]);
  renderModels(modelResult.data||[]);
  renderRecent(recentResult.data||[]);
  if(!countResult.error&&typeof countResult.count==='number')$('#approvedBuildCount').textContent=String(countResult.count);
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
  const redirectTo=`${window.location.origin}${window.location.pathname}`;
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

  if(!gameId||!implementationName){
    setMessage(message,'Choose a game and give the implementation a name.','error');
    return;
  }
  if(models.length<1||models.length>12){
    setMessage(message,'List between 1 and 12 models, separated by commas.','error');
    return;
  }
  if(!isValidHttpsUrl(liveUrl)){
    setMessage(message,'Use a valid HTTPS production URL.','error');
    return;
  }
  if(!isGitHubSource(sourceUrl)){
    setMessage(message,'Source must be a public GitHub repository URL.','error');
    return;
  }
  if(!confirmed){
    setMessage(message,'Confirm the source/permission statement before submitting.','error');
    return;
  }

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
  setMessage(message,'Submitted. Your build is pending review and will enter the Builder Board once approved.','success');
  await loadMySubmissions();
}

async function init(){
  await loadCatalog();

  if(!window.supabase?.createClient){
    setMessage($('#authMessage'),'Authentication library failed to load. Refresh and try again.','error');
    renderBoard([]);
    renderModels([]);
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
  await loadPublicData();
  if(state.session){
    await loadMySubmissions();
    if(sessionStorage.getItem('builderBoardReturnToSubmit')==='1'){
      sessionStorage.removeItem('builderBoardReturnToSubmit');
      window.location.hash='submit';
    }
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
  console.error('App initialization failed',error);
  setMessage($('#authMessage'),'The Builder Board could not initialize. Refresh and try again.','error');
});

import('/community-voting.js').catch(error=>console.error('Community voting module failed',error));
