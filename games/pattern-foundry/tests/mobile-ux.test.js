const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');

assert.match(html,/id="firstTurnHint"/,'first-turn hint should exist in the game shell');
assert.match(html,/Pick a color[^<]*→[^<]*Tap a highlighted row/,'hint should explain the two-step mobile interaction');
assert.match(game,/firstTurnHint/,'game renderer should control first-turn hint visibility');
assert.match(game,/state\.moves/,'hint should disappear after the first completed move');
assert.match(game,/board-row-pair/,'each pattern row should render beside its matching wall row');
assert.match(game,/wall-row/,'wall tiles should render in explicit matching rows');
assert.match(css,/\.board-row-pair\{[^}]*display:grid[^}]*grid-template-columns/s,'paired rows should share one grid row');
assert.match(css,/\.pattern-row\{[^}]*height:100%/s,'pattern row should stretch to the wall row height');
assert.match(css,/@media\(max-width:620px\)[\s\S]*\.first-turn-hint\{/,'first-turn hint should be mobile-only');

console.log('pattern foundry mobile UX test passed');
