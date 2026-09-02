const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') || document.createElement('link');
appleTouchIcon.rel = 'apple-touch-icon';
appleTouchIcon.sizes = '180x180';
appleTouchIcon.href = '/apple-touch-icon.png';
if (!appleTouchIcon.parentNode) document.head.appendChild(appleTouchIcon);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.warn('TrainGames offline shell registration failed', error);
    });
  });
}
