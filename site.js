const siteRoot=new URL('./',document.currentScript?.src||location.href);
const appleTouchIcon=document.querySelector('link[rel="apple-touch-icon"]')||document.createElement('link');
appleTouchIcon.rel='apple-touch-icon';
appleTouchIcon.sizes='180x180';
appleTouchIcon.href=new URL('apple-touch-icon.png',siteRoot).href;
if(!appleTouchIcon.parentNode)document.head.appendChild(appleTouchIcon);

if('serviceWorker'in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register(new URL('sw.js',siteRoot).href,{scope:siteRoot.pathname}).catch(error=>{
      console.warn('TrainGames offline shell registration failed',error);
    });
  });
}