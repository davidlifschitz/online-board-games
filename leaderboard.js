const SUPABASE_URL='https://slnvfdkyvijrhmisurhw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_zUTHu9mHMbPfNKIgM_O0Zg_INCN9yF6';
const $=selector=>document.querySelector(selector);
const state={catalog:[]};

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
function gameTitle(gameId){return state.catalog.find(game=>game.id===gameId)?.title||gameId;}
function renderBoard(rows){
  const container=$('#builderBoard');
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
function renderRecent(rows){
  const container=$('#recentBuilds');
  const meta=$('#recentBuildMeta');
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
async function loadPublicData(client){
  const [boardResult,modelResult,recentResult,countResult]=await Promise.all([
    client.from('builder_leaderboard').select('*').order('games_shipped',{ascending:false}).order('first_implementations',{ascending:false}).order('latest_ship_at',{ascending:true}),
    client.from('model_usage').select('*').order('implementations',{ascending:false}).order('model',{ascending:true}),
    client.from('builder_submissions').select('game_id,implementation_name,live_url,source_url,models,builder_display_name,identity_provider,approved_at').eq('status','approved').order('approved_at',{ascending:false}).limit(9),
    client.from('builder_submissions').select('id',{count:'exact',head:true}).eq('status','approved')
  ]);
  if(boardResult.error)console.error('Builder Board load failed',boardResult.error);
  if(modelResult.error)console.error('Model usage load failed',modelResult.error);
  if(recentResult.error)console.error('Recent builds load failed',recentResult.error);
  renderBoard(boardResult.data||[]);
  renderModels(modelResult.data||[]);
  renderRecent(recentResult.data||[]);
  if(!countResult.error&&typeof countResult.count==='number')$('#approvedBuildCount').textContent=String(countResult.count);
}
async function init(){
  if(!window.supabase?.createClient){
    renderBoard([]);
    renderModels([]);
    throw new Error('Supabase library failed to load');
  }
  const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
  });
  window.builderBoardSupabaseClient=client;
  window.dispatchEvent(new CustomEvent('builder-board-client-ready',{detail:{client}}));
  await loadCatalog();
  await loadPublicData(client);
  await import('/community-voting.js');
}
init().catch(error=>{
  console.error('Leaderboard initialization failed',error);
});
