(() => {
  'use strict';

  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = -1;
  const DIRS = [
    [-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]
  ];
  const WEIGHTS = [
    [120,-25,20,5,5,20,-25,120],
    [-25,-45,-5,-5,-5,-5,-45,-25],
    [20,-5,15,3,3,15,-5,20],
    [5,-5,3,3,3,3,-5,5],
    [5,-5,3,3,3,3,-5,5],
    [20,-5,15,3,3,15,-5,20],
    [-25,-45,-5,-5,-5,-5,-45,-25],
    [120,-25,20,5,5,20,-25,120]
  ];

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const blackScoreEl = document.getElementById('black-score');
  const whiteScoreEl = document.getElementById('white-score');
  const blackCard = document.getElementById('black-card');
  const whiteCard = document.getElementById('white-card');
  const blackLabel = document.getElementById('black-label');
  const whiteLabel = document.getElementById('white-label');
  const turnPill = document.getElementById('turn-pill');
  const difficultyEl = document.getElementById('difficulty');
  const newGameBtn = document.getElementById('new-game');
  const showHintsEl = document.getElementById('show-hints');
  const colorButtons = [...document.querySelectorAll('[data-color]')];
  const cells = [];

  let board = createInitialBoard();
  let human = BLACK;
  let computer = WHITE;
  let current = BLACK;
  let gameOver = false;
  let computerThinking = false;
  let lastMove = null;
  let gameToken = 0;
  let showHints = readHintsPreference();

  function createInitialBoard() {
    const b = Array.from({ length: 8 }, () => Array(8).fill(EMPTY));
    b[3][3] = WHITE; b[3][4] = BLACK;
    b[4][3] = BLACK; b[4][4] = WHITE;
    return b;
  }

  function readHintsPreference() {
    try {
      const stored = localStorage.getItem('discshift-show-hints');
      return stored === null ? true : stored === 'true';
    } catch {
      return true;
    }
  }

  function saveHintsPreference() {
    try { localStorage.setItem('discshift-show-hints', String(showHints)); } catch {}
  }

  function inBounds(r,c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

  function flipsForMove(b, r, c, player) {
    if (!inBounds(r,c) || b[r][c] !== EMPTY) return [];
    const flips = [];
    for (const [dr,dc] of DIRS) {
      const line = [];
      let rr = r + dr, cc = c + dc;
      while (inBounds(rr,cc) && b[rr][cc] === -player) {
        line.push([rr,cc]); rr += dr; cc += dc;
      }
      if (line.length && inBounds(rr,cc) && b[rr][cc] === player) flips.push(...line);
    }
    return flips;
  }

  function legalMoves(b, player) {
    const moves = [];
    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      const flips = flipsForMove(b,r,c,player);
      if (flips.length) moves.push({ r,c,flips });
    }
    return moves;
  }

  function applyMove(b, move, player) {
    const next = b.map(row => row.slice());
    next[move.r][move.c] = player;
    for (const [r,c] of move.flips) next[r][c] = player;
    return next;
  }

  function counts(b) {
    let black = 0, white = 0;
    for (const row of b) for (const cell of row) {
      if (cell === BLACK) black++;
      if (cell === WHITE) white++;
    }
    return { black, white };
  }

  function initializeBoardDom() {
    const fragment = document.createDocumentFragment();
    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.setAttribute('role', 'gridcell');
      cell.dataset.row = String(r);
      cell.dataset.col = String(c);
      cell.addEventListener('click', () => {
        if (gameOver || computerThinking || current !== human) return;
        const flips = flipsForMove(board, r, c, human);
        if (!flips.length) return;
        humanMove({ r, c, flips });
      });
      cells.push(cell);
      fragment.appendChild(cell);
    }
    boardEl.appendChild(fragment);
  }

  function syncCell(cell, r, c, legalSet) {
    const key = `${r},${c}`;
    const isLegal = legalSet.has(key);
    cell.classList.toggle('legal', isLegal);
    cell.classList.toggle('show-hint', isLegal && showHints);
    cell.classList.toggle('last-move', Boolean(lastMove && lastMove.r === r && lastMove.c === c));
    cell.setAttribute('aria-label', isLegal ? `Legal move at row ${r+1}, column ${c+1}` : `Row ${r+1}, column ${c+1}`);

    const value = board[r][c];
    let piece = cell.firstElementChild;
    if (value === EMPTY) {
      if (piece) piece.remove();
      return;
    }

    if (!piece) {
      piece = document.createElement('span');
      piece.className = 'piece';
      cell.appendChild(piece);
    }
    piece.classList.toggle('black', value === BLACK);
    piece.classList.toggle('white', value === WHITE);
  }

  function render() {
    const legal = !gameOver && current === human && !computerThinking ? legalMoves(board, human) : [];
    const legalSet = new Set(legal.map(m => `${m.r},${m.c}`));

    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      syncCell(cells[r * 8 + c], r, c, legalSet);
    }

    const { black, white } = counts(board);
    blackScoreEl.textContent = black;
    whiteScoreEl.textContent = white;
    blackCard.classList.toggle('active', current === BLACK && !gameOver);
    whiteCard.classList.toggle('active', current === WHITE && !gameOver);
    blackLabel.textContent = human === BLACK ? 'You' : 'Computer';
    whiteLabel.textContent = human === WHITE ? 'You' : 'Computer';

    if (gameOver) {
      turnPill.textContent = 'Game over';
    } else if (computerThinking) {
      turnPill.textContent = 'Computer thinking…';
    } else {
      turnPill.textContent = current === human ? 'Your turn' : 'Computer turn';
    }
  }

  function setStatus(text) { statusEl.textContent = text; }

  function humanMove(move) {
    if (gameOver || computerThinking || current !== human) return;
    board = applyMove(board, move, human);
    lastMove = { r: move.r, c: move.c };
    current = computer;
    render();
    resolveTurnFlow();
  }

  function resolveTurnFlow() {
    if (gameOver) return;
    const currentMoves = legalMoves(board, current);
    const otherMoves = legalMoves(board, -current);

    if (!currentMoves.length && !otherMoves.length) {
      finishGame();
      return;
    }

    if (!currentMoves.length) {
      const skipped = current;
      current = -current;
      setStatus(`${skipped === human ? 'You have' : 'The computer has'} no legal move, so the turn passes.`);
      render();
      if (current === computer) queueComputerMove();
      return;
    }

    if (current === computer) {
      setStatus('Computer is choosing a move…');
      queueComputerMove();
    } else {
      setStatus(showHints ? 'Your turn. Choose a highlighted square.' : 'Your turn. Choose a legal square.');
      render();
    }
  }

  function queueComputerMove() {
    const token = gameToken;
    computerThinking = true;
    render();
    setTimeout(() => {
      if (token !== gameToken || gameOver || current !== computer) return;
      const moves = legalMoves(board, computer);
      if (!moves.length) {
        computerThinking = false;
        resolveTurnFlow();
        return;
      }
      const move = chooseComputerMove(board, computer, difficultyEl.value);
      board = applyMove(board, move, computer);
      lastMove = { r: move.r, c: move.c };
      computerThinking = false;
      current = human;
      render();
      resolveTurnFlow();
    }, 260);
  }

  function chooseComputerMove(b, player, difficulty) {
    const moves = legalMoves(b, player);
    if (difficulty === 'easy') return moves[Math.floor(Math.random() * moves.length)];
    const depth = difficulty === 'hard' ? 5 : 3;
    const cache = new Map();
    let best = moves[0];
    let bestScore = -Infinity;
    for (const move of orderedMoves(moves)) {
      const next = applyMove(b, move, player);
      const score = minimax(next, -player, player, depth - 1, -Infinity, Infinity, cache);
      if (score > bestScore) { bestScore = score; best = move; }
    }
    return best;
  }

  function boardKey(b, turn, depth) {
    let key = `${turn}:${depth}:`;
    for (const row of b) key += row.map(v => v === BLACK ? '1' : v === WHITE ? '2' : '0').join('');
    return key;
  }

  function minimax(b, turn, maximizingPlayer, depth, alpha, beta, cache) {
    const key = boardKey(b, turn, depth);
    if (cache.has(key)) return cache.get(key);

    const moves = legalMoves(b, turn);
    const otherMoves = legalMoves(b, -turn);
    if (depth <= 0 || (!moves.length && !otherMoves.length)) {
      const score = evaluate(b, maximizingPlayer);
      cache.set(key, score);
      return score;
    }
    if (!moves.length) {
      const score = minimax(b, -turn, maximizingPlayer, depth - 1, alpha, beta, cache);
      cache.set(key, score);
      return score;
    }

    if (turn === maximizingPlayer) {
      let value = -Infinity;
      for (const move of orderedMoves(moves)) {
        value = Math.max(value, minimax(applyMove(b, move, turn), -turn, maximizingPlayer, depth - 1, alpha, beta, cache));
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
      cache.set(key, value);
      return value;
    }

    let value = Infinity;
    for (const move of orderedMoves(moves)) {
      value = Math.min(value, minimax(applyMove(b, move, turn), -turn, maximizingPlayer, depth - 1, alpha, beta, cache));
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    cache.set(key, value);
    return value;
  }

  function orderedMoves(moves) {
    return moves.slice().sort((a,b) => WEIGHTS[b.r][b.c] - WEIGHTS[a.r][a.c]);
  }

  function evaluate(b, player) {
    let position = 0;
    let mine = 0, theirs = 0;
    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      if (b[r][c] === player) { mine++; position += WEIGHTS[r][c]; }
      else if (b[r][c] === -player) { theirs++; position -= WEIGHTS[r][c]; }
    }
    const myMoves = legalMoves(b, player).length;
    const theirMoves = legalMoves(b, -player).length;
    const mobility = 8 * (myMoves - theirMoves);
    const occupied = mine + theirs;
    const discWeight = occupied > 50 ? 4 : occupied > 42 ? 1.5 : .2;
    return position + mobility + discWeight * (mine - theirs);
  }

  function finishGame() {
    gameOver = true;
    computerThinking = false;
    const { black, white } = counts(board);
    const humanScore = human === BLACK ? black : white;
    const computerScore = human === BLACK ? white : black;
    if (humanScore > computerScore) setStatus(`You win ${humanScore}–${computerScore}. Nice game.`);
    else if (humanScore < computerScore) setStatus(`Computer wins ${computerScore}–${humanScore}. Try another round.`);
    else setStatus(`Draw: ${humanScore}–${computerScore}.`);
    render();
  }

  function startGame() {
    gameToken++;
    board = createInitialBoard();
    current = BLACK;
    gameOver = false;
    computerThinking = false;
    lastMove = null;
    setStatus(human === BLACK ? (showHints ? 'You are Black. Place a disc on a highlighted square.' : 'You are Black. Place a disc on a legal square.') : 'You are White. The computer moves first.');
    render();
    if (computer === BLACK) queueComputerMove();
  }

  colorButtons.forEach(btn => btn.addEventListener('click', () => {
    human = btn.dataset.color === 'black' ? BLACK : WHITE;
    computer = -human;
    colorButtons.forEach(b => b.classList.toggle('active', b === btn));
    startGame();
  }));

  showHintsEl.checked = showHints;
  showHintsEl.addEventListener('change', () => {
    showHints = showHintsEl.checked;
    saveHintsPreference();
    render();
    if (!gameOver && current === human && !computerThinking) {
      setStatus(showHints ? 'Your turn. Choose a highlighted square.' : 'Your turn. Move hints are hidden.');
    }
  });

  newGameBtn.addEventListener('click', startGame);

  initializeBoardDom();
  startGame();
})();
