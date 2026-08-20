(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.TrainGamesBuildCatalog=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const DIFFICULTIES=['starter','intermediate','advanced'];

  function groupChallengeGames(games){
    const grouped={starter:[],intermediate:[],advanced:[]};
    (games||[])
      .filter(game=>game&&game.prompt&&game.status==='unbuilt'&&DIFFICULTIES.includes(game.difficulty))
      .sort((a,b)=>a.title.localeCompare(b.title))
      .forEach(game=>grouped[game.difficulty].push(game));
    return grouped;
  }

  function claimUrlForGame(game){
    const title=`Claim: ${game?.title||'Game'}`;
    return `https://github.com/davidlifschitz/online-board-games/issues/new?template=claim-a-game.yml&title=${encodeURIComponent(title)}`;
  }

  return {groupChallengeGames,claimUrlForGame};
});
