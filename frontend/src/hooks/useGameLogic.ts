import { useState, useEffect } from "react";

type GameMode = "friend" | "impossible";
type PlayerSymbol = "X" | "O";

export const useGameLogic = () => {
  const [cells, setCells] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const [xScore, setXScore] = useState<number>(0);
  const [oScore, setOScore] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>("friend");
  const [isAITurn, setIsAITurn] = useState<boolean>(false);
  const [humanPlayer, setHumanPlayer] = useState<PlayerSymbol>("X");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinnerWithoutSideEffects = (cells: string[]) => {
    const winPatterns = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal top-left to bottom-right
      [2, 4, 6], // Diagonal top-right to bottom-left
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return { winner: cells[a], line: pattern };
      }
    }
    
    return { winner: null, line: null };
  };

  const checkWinner = (cells: string[]) => {
    const result = checkWinnerWithoutSideEffects(cells);
    setWinningLine(result.line);
    return result.winner;
  };

  // Minimax algorithm 
  const minimax = (
    board: string[],
    depth: number,
    isMaximizing: boolean,
    aiSymbol: string
  ): number => {
    const result = checkWinnerWithoutSideEffects(board);
    const winner = result.winner;
    const humanSymbol = aiSymbol === "O" ? "X" : "O";

    if (winner === aiSymbol) return 10 - depth;
    if (winner === humanSymbol) return depth - 10;
    if (board.every((cell) => cell !== "")) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = aiSymbol;
          const score = minimax(board, depth + 1, false, aiSymbol);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = humanSymbol;
          const score = minimax(board, depth + 1, true, aiSymbol);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = (board: string[]): number => {
    const aiSymbol = humanPlayer === "X" ? "O" : "X";
    
    const emptyCells = board.filter(cell => cell === "").length;
    
    if (emptyCells === 9) {
      const allMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const weights = [3, 2, 3, 2, 4, 2, 3, 2, 3]; 
      
      const weightedMoves: number[] = [];
      allMoves.forEach((move, index) => {
        for (let i = 0; i < weights[index]; i++) {
          weightedMoves.push(move);
        }
      });
      
      return weightedMoves[Math.floor(Math.random() * weightedMoves.length)];
    }
    
    if (emptyCells === 8) {
      const moveScores: { move: number; score: number }[] = [];
      
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = aiSymbol;
          const score = minimax(board, 0, false, aiSymbol);
          board[i] = "";
          moveScores.push({ move: i, score });
        }
      }
      
      const bestScore = Math.max(...moveScores.map(ms => ms.score));
      const bestMoves = moveScores.filter(ms => ms.score === bestScore);
      
      if (bestMoves.length > 1) {
        return bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
      }
      
      return bestMoves[0].move;
    }
    
    const moveScores: { move: number; score: number }[] = [];
    
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = aiSymbol;
        const score = minimax(board, 0, false, aiSymbol);
        board[i] = "";
        moveScores.push({ move: i, score });
      }
    }
    
    const bestScore = Math.max(...moveScores.map(ms => ms.score));
    const bestMoves = moveScores.filter(ms => ms.score === bestScore);
    
    if (bestMoves.length > 1) {
      return bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
    }
    
    return bestMoves[0].move;
  };

  const makeAIMove = (currentCells: string[]) => {
    const aiSymbol = humanPlayer === "X" ? "O" : "X";
    const bestMove = getBestMove([...currentCells]);
    if (bestMove !== -1) {
      const newCells = [...currentCells];
      newCells[bestMove] = aiSymbol;
      setCells(newCells);

      const win = checkWinner(newCells);
      if (win) {
        setWinner(win);
        if (win === "X") {
          setXScore((prev) => prev + 1);
        } else {
          setOScore((prev) => prev + 1);
        }
      } else if (newCells.every((cell) => cell !== "")) {
        setDraw(true);
      } else {
        setCurrentPlayer(humanPlayer);
        setIsAITurn(false);
      }
    }
  };

  const aiSymbol = humanPlayer === "X" ? "O" : "X";

  useEffect(() => {
    if (
      gameMode === "impossible" &&
      gameStarted &&
      currentPlayer === aiSymbol &&
      !winner &&
      !draw &&
      !isAITurn
    ) {
      setIsAITurn(true);
      setTimeout(() => {
        makeAIMove(cells);
      }, 700);
    }
  }, [
    currentPlayer,
    gameMode,
    winner,
    draw,
    cells,
    isAITurn,
    aiSymbol,
    gameStarted,
  ]);

  const handleClick = (index: number) => {
    if (cells[index] || winner || draw) return;

    if (gameMode === "impossible" && currentPlayer !== humanPlayer) return;

    const newCells = [...cells];
    newCells[index] = currentPlayer;
    setCells(newCells);

    const win = checkWinner(newCells);

    if (win) {
      setWinner(win);
      if (win === "X") {
        setXScore((prev) => prev + 1);
      } else {
        setOScore((prev) => prev + 1);
      }
    } else if (newCells.every((cell) => cell !== "")) {
      setDraw(true);
    } else {
      if (gameMode === "friend") {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      } else {
        setCurrentPlayer(aiSymbol);
      }
    }
  };

  const restartGame = () => {
    setCells(Array(9).fill(""));
    setWinner(null);
    setCurrentPlayer("X");
    setDraw(false);
    setIsAITurn(false);
    setWinningLine(null); 
    if (gameMode === "impossible") {
      setGameStarted(false);
    }
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setCells(Array(9).fill(""));
    setWinner(null);
    setCurrentPlayer("X");
    setDraw(false);
    setIsAITurn(false);
    setHumanPlayer("X");
    setXScore(0);
    setOScore(0);
    setWinningLine(null); 
    

    if (mode === "friend") {
      setGameStarted(true);
    } else {
      setGameStarted(false);
    }
  };

  const handlePlayerChoice = (symbol: PlayerSymbol) => {
    console.log("Player chose:", symbol);
    setHumanPlayer(symbol);
    setCurrentPlayer("X");
    setGameStarted(true);
    console.log("Game started:", true);
  };

  console.log("Game State:", { 
    gameMode, 
    gameStarted, 
    winner, 
    draw, 
    cells: cells.filter(cell => cell !== "").length,
    currentPlayer,
    isAITurn
  });

  return {
    cells,
    currentPlayer,
    winner,
    draw,
    xScore,
    oScore,
    gameMode,
    isAITurn,
    humanPlayer,
    gameStarted,
    winningLine, 
    
    handleClick,
    restartGame,
    handleModeChange,
    handlePlayerChoice,
    
    aiSymbol,
  };
};