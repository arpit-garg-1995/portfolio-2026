import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';

const lines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const empty = () => Array(9).fill('');

function winner(board) {
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return 'draw';
  return null;
}

function moves(board) {
  return board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
}

function minimax(board, isMaximizing, ai, human) {
  const result = winner(board);
  if (result === ai) return { score: 10 };
  if (result === human) return { score: -10 };
  if (result === 'draw') return { score: 0 };

  if (isMaximizing) {
    let best = { score: -Infinity, index: -1 };
    for (const idx of moves(board)) {
      const next = [...board];
      next[idx] = ai;
      const score = minimax(next, false, ai, human).score;
      if (score > best.score) best = { score, index: idx };
    }
    return best;
  }

  let best = { score: Infinity, index: -1 };
  for (const idx of moves(board)) {
    const next = [...board];
    next[idx] = human;
    const score = minimax(next, true, ai, human).score;
    if (score < best.score) best = { score, index: idx };
  }
  return best;
}

function randomMove(board) {
  const options = moves(board);
  return options[Math.floor(Math.random() * options.length)];
}

export default function GameTicTacToe() {
  const [playerBoard, setPlayerBoard] = useState(empty());
  const [coachBoard, setCoachBoard] = useState(empty());
  const [status, setStatus] = useState('You are X. Beat the bot on the left.');
  const [coachStatus, setCoachStatus] = useState('Coach board shows how a minimax X starts.');
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });

  useEffect(() => {
    const raw = localStorage.getItem('ag-ttt-stats');
    if (raw) setStats(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('ag-ttt-stats', JSON.stringify(stats));
  }, [stats]);

  const summary = useMemo(() => `W ${stats.wins} · L ${stats.losses} · D ${stats.draws}`, [stats]);

  const finishPlayerGame = (result) => {
    if (result === 'X') {
      setStatus('You win. Nice line.');
      setStats((s) => ({ ...s, wins: s.wins + 1 }));
    } else if (result === 'O') {
      setStatus('Bot wins. Try the corner-open next.');
      setStats((s) => ({ ...s, losses: s.losses + 1 }));
    } else {
      setStatus('Draw. Perfect play does that a lot.');
      setStats((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  const advanceCoachBoard = () => {
    setCoachBoard((current) => {
      let next = [...current];
      const state = winner(next);
      if (state) {
        setCoachStatus(state === 'draw' ? 'Coach board ended in a draw.' : `Coach board winner: ${state}`);
        return next;
      }

      const xMove = minimax(next, true, 'X', 'O').index;
      if (xMove > -1) next[xMove] = 'X';
      const afterX = winner(next);
      if (afterX) {
        setCoachStatus(afterX === 'draw' ? 'Coach board ended in a draw.' : `Coach board winner: ${afterX}`);
        return next;
      }

      const oMove = randomMove(next);
      if (oMove !== undefined) next[oMove] = 'O';
      const afterO = winner(next);
      setCoachStatus(afterO ? (afterO === 'draw' ? 'Coach board ended in a draw.' : `Coach board winner: ${afterO}`) : 'Coach bot played the strongest X move again.');
      return next;
    });
  };

  const handlePlayerMove = (index) => {
    if (playerBoard[index] || winner(playerBoard)) return;

    const afterPlayer = [...playerBoard];
    afterPlayer[index] = 'X';
    setPlayerBoard(afterPlayer);
    advanceCoachBoard();

    const playerResult = winner(afterPlayer);
    if (playerResult) {
      finishPlayerGame(playerResult);
      return;
    }

    const aiIndex = minimax(afterPlayer, true, 'O', 'X').index;
    if (aiIndex > -1) afterPlayer[aiIndex] = 'O';

    const finalResult = winner(afterPlayer);
    setPlayerBoard([...afterPlayer]);

    if (finalResult) finishPlayerGame(finalResult);
    else setStatus('Your move. Watch the coach board for one optimal opening sequence.');
  };

  const reset = () => {
    setPlayerBoard(empty());
    setCoachBoard(empty());
    setStatus('You are X. Beat the bot on the left.');
    setCoachStatus('Coach board shows how a minimax X starts.');
  };

  return (
    <section class="card">
      <div class="game-header">
        <div>
          <h2>Twin Tic-Tac-Toe</h2>
          <p class="game-note">Left: you vs minimax. Right: minimax X vs random O, advancing alongside your turns.</p>
        </div>
        <div class="game-actions">
          <span class="pill mono">{summary}</span>
          <button class="btn btn-secondary" type="button" onClick={reset}>Reset</button>
        </div>
      </div>

      <div class="boards">
        <div class="mini-card">
          <h3>Your Board</h3>
          <p class="game-note">{status}</p>
          <div class="board" role="grid" aria-label="Your tic tac toe board">
            {playerBoard.map((cell, idx) => (
              <button
                key={idx}
                class="cell"
                type="button"
                disabled={!!cell || !!winner(playerBoard)}
                onClick={() => handlePlayerMove(idx)}
                aria-label={`Cell ${idx + 1}`}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>

        <div class="mini-card">
          <h3>Coach Board</h3>
          <p class="game-note">{coachStatus}</p>
          <div class="board" role="grid" aria-label="Coach tic tac toe board">
            {coachBoard.map((cell, idx) => (
              <button key={idx} class="cell" type="button" disabled aria-label={`Coach cell ${idx + 1}`}>
                {cell}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
