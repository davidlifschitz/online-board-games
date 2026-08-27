(()=>{'use strict';
const root=document.getElementById('tg2-legacy-root');
if(!root)return;
const sourceUrl=new URL('../',location.href);
const resources=new Set([sourceUrl.href]);
function absolute(value){try{return new URL(value,sourceUrl).href}catch{return value}}
function rewriteRelative(container){
  container.querySelectorAll('[href]').forEach(el=>{const v=el.getAttribute('href');if(v&&!v.startsWith('#')&&!v.startsWith('javascript:'))el.setAttribute('href',absolute(v))});
  container.querySelectorAll('[src]').forEach(el=>{const v=el.getAttribute('src');if(v)el.setAttribute('src',absolute(v))});
}
async function runScript(original){
  const src=original.getAttribute('src');
  if(src&&/gameplay-ui\.js(?:\?|$)/.test(src))return;
  const s=document.createElement('script');
  for(const attr of original.attributes)if(attr.name!=='src')s.setAttribute(attr.name,attr.value);
  if(src){s.src=absolute(src);resources.add(s.src);await new Promise((resolve,reject)=>{s.onload=resolve;s.onerror=reject;document.body.append(s)})}
  else{s.textContent=original.textContent;document.body.append(s)}
}
async function cacheResources(){
  if(!('serviceWorker'in navigator))return;
  try{const reg=await navigator.serviceWorker.ready;reg.active?.postMessage({type:'TG2_CACHE_RESOURCES',urls:[...resources]})}catch{}
}
async function boot(){
  try{
    const response=await fetch(sourceUrl.href,{cache:'no-cache'});if(!response.ok)throw new Error(`V1 source returned ${response.status}`);
    const html=await response.text(),doc=new DOMParser().parseFromString(html,'text/html');
    const anchor=document.querySelector('link[data-tg2-style]');
    doc.head.querySelectorAll('style,link[rel="stylesheet"]').forEach(node=>{
      if(node.tagName==='LINK'&&/gameplay-ui\.css(?:\?|$)/.test(node.getAttribute('href')||''))return;
      const clone=node.cloneNode(true);if(clone.tagName==='LINK'){clone.href=absolute(node.getAttribute('href'));resources.add(clone.href)}
      anchor?.parentNode.insertBefore(clone,anchor);
    });
    const scripts=[...doc.body.querySelectorAll('script')];scripts.forEach(s=>s.remove());
    rewriteRelative(doc.body);
    root.replaceChildren(...[...doc.body.childNodes].map(n=>document.importNode(n,true)));
    for(const script of scripts)await runScript(script);
    root.classList.add('tg2-loaded');
    await cacheResources();
    window.dispatchEvent(new CustomEvent('traingames:v2-ready',{detail:{source:sourceUrl.href}}));
  }catch(error){
    root.innerHTML=`<section class="tg2-load-error"><strong>V2 could not load this game.</strong><p>${String(error.message||error)}</p><a href="../">Open V1</a></section>`;
  }
}
boot();
})();
