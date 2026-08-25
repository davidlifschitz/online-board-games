(() => {
  const media = window.matchMedia('(max-width: 900px)');
  const gameLayout = document.querySelector('.game-layout');
  const boardPanel = document.querySelector('#board-view');
  const piecesPanel = document.querySelector('#pieces-view');
  const tray = document.querySelector('#piece-tray');
  const gameShell = document.querySelector('#game-shell');
  const boardHint = document.querySelector('.board-title small');
  const originalSelectPiece = window.selectPiece;

  if (!gameLayout || !boardPanel || !piecesPanel || !tray || typeof originalSelectPiece !== 'function') return;

  let autoSelectFrame = 0;

  function syncMobileLayout() {
    if (media.matches) {
      if (piecesPanel.parentElement !== boardPanel) boardPanel.appendChild(piecesPanel);
      if (boardHint) boardHint.textContent = 'Pick a piece below, then tap a spot. Wrong spot? Keep trying.';
      return;
    }

    if (piecesPanel.parentElement !== gameLayout) gameLayout.appendChild(piecesPanel);
    if (boardHint) boardHint.textContent = 'Tap a piece, then tap a spot. Wrong spot? Keep trying.';
  }

  function scrollSelectedPieceIntoView(button) {
    if (!button) return;
    const left = Math.max(0, button.offsetLeft - (tray.clientWidth - button.clientWidth) / 2);
    tray.scrollTo({ left, behavior: 'smooth' });
  }

  function autoSelectNext() {
    if (!media.matches || gameShell?.hidden) return;
    cancelAnimationFrame(autoSelectFrame);
    autoSelectFrame = requestAnimationFrame(() => {
      if (tray.querySelector('.piece-button.selected')) return;
      const next = tray.querySelector('.piece-button');
      if (!next) return;
      originalSelectPiece(next.dataset.pieceId, false);
      scrollSelectedPieceIntoView(next);
    });
  }

  tray.addEventListener('click', event => {
    if (!media.matches) return;
    const button = event.target.closest('.piece-button');
    if (!button || !tray.contains(button)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const pieceId = button.dataset.pieceId;
    originalSelectPiece(pieceId, false);
    scrollSelectedPieceIntoView(button);
  }, true);

  new MutationObserver(autoSelectNext).observe(tray, { childList: true });

  media.addEventListener?.('change', () => {
    syncMobileLayout();
    autoSelectNext();
  });

  syncMobileLayout();
  autoSelectNext();
})();
