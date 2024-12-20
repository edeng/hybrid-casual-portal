import { useState, useEffect } from "react";
import { GRID_SIZE, BASE_SCORE } from "../constants/config";
import { GAME_MODES } from "../constants/gameModes";

const createGrid = () => {
  return Array(GRID_SIZE)
    .fill()
    .map(() =>
      Array(GRID_SIZE)
        .fill()
        .map(() => ({
          value: Math.floor(Math.random() * 5) + 1,
          id: Math.random(),
        }))
    );
};

const initialState = {
  grid: createGrid(),
  score: 0,
  moves: 0,
  matches: 0,
  longChains: 0,
  selectedTiles: [],
  currentSum: 0,
  level: 1,
  timeLeft: 60,
  gameOver: false,
};

export const useGame = () => {
  const [state, setState] = useState(initialState);
  const currentMode = GAME_MODES[(state.level - 1) % GAME_MODES.length];

  useEffect(() => {
    if (!currentMode.timeLimit) return;

    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        timeLeft: Math.max(0, prev.timeLeft - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMode]);

  const isAdjacent = (lastTile, currentTile) => {
    if (!lastTile) return true; // First tile can be any tile
    const dx = Math.abs(lastTile.row - currentTile.row);
    const dy = Math.abs(lastTile.col - currentTile.col);
    return dx + dy === 1; // Ensure tiles are directly adjacent
  };

  const handleTileSelect = (row, col) => {
    if (state.gameOver) return;

    const currentTile = { row, col, value: state.grid[row][col].value };
    const lastTile = state.selectedTiles[state.selectedTiles.length - 1];

    if (!isAdjacent(lastTile, currentTile)) return; // Ignore non-adjacent tiles

    const selectedIndex = state.selectedTiles.findIndex(
      (tile) => tile.row === row && tile.col === col
    );

    // Undo logic: If the tile is already selected, undo back to this point
    if (selectedIndex !== -1) {
      const newSelectedTiles = state.selectedTiles.slice(0, selectedIndex);
      const newSum = newSelectedTiles.reduce(
        (sum, tile) => sum + tile.value,
        0
      );
      setState((prev) => ({
        ...prev,
        selectedTiles: newSelectedTiles,
        currentSum: newSum,
      }));
      return;
    }

    const newSum = state.currentSum + currentTile.value;

    if (newSum === currentMode.target) {
      // Correct sum: clear selectedTiles after handling match
      handleMatch([...state.selectedTiles, currentTile]);
    } else if (newSum > currentMode.target) {
      // Too high: clear selection and reset
      setState((prev) => ({
        ...prev,
        selectedTiles: [],
        currentSum: 0,
      }));
    } else {
      // Add tile to the chain
      setState((prev) => ({
        ...prev,
        selectedTiles: [...prev.selectedTiles, currentTile],
        currentSum: newSum,
      }));
    }
  };

  const handleMatch = (matchedTiles) => {
    const points = BASE_SCORE * matchedTiles.length;
    const isLongChain =
      matchedTiles.length >= (currentMode.minChainLength || 0);

    setState((prev) => {
      const newState = {
        ...prev,
        score: prev.score + points,
        matches: prev.matches + 1,
        longChains: isLongChain ? prev.longChains + 1 : prev.longChains,
        selectedTiles: [],
        currentSum: 0,
        grid: createGrid(), // Simplified for MVP - later add animations
      };

      if (currentMode.winCondition(newState)) {
        return {
          ...newState,
          level: prev.level + 1,
          moves: 0,
          matches: 0,
          longChains: 0,
          timeLeft: GAME_MODES[prev.level % GAME_MODES.length].timeLimit || 60,
        };
      }

      return newState;
    });
  };

  const progress = getProgress(state, currentMode);

  return {
    state,
    currentMode,
    handleTileSelect,
    progress,
  };
};

const getProgress = (state, mode) => {
  switch (mode.type) {
    case "BASIC_SUM":
      return { current: state.matches, required: 5 };
    case "TARGET_PRACTICE":
      return { current: state.moves, required: mode.moveLimit };
    case "CHAIN":
      return { current: state.longChains, required: 3 };
    default:
      return null;
  }
};
