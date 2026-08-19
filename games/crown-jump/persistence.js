const GAME_KEY='crown-jump:local-game:v2',SETTINGS_KEY='crown-jump:settings:v2';
const parse=(storage,key)=>{try{const raw=storage?.getItem?.(key);return raw?JSON.parse(raw):null}catch{return null}};
export const loadLocalGame=(storage=globalThis.localStorage)=>parse(storage,GAME_KEY);
export const saveLocalGame=(payload,storage=globalThis.localStorage)=>{try{storage?.setItem?.(GAME_KEY,JSON.stringify(payload));return true}catch{return false}};
export const loadSettings=(storage=globalThis.localStorage)=>parse(storage,SETTINGS_KEY)||{};
export const saveSettings=(settings,storage=globalThis.localStorage)=>{try{storage?.setItem?.(SETTINGS_KEY,JSON.stringify(settings));return true}catch{return false}};
