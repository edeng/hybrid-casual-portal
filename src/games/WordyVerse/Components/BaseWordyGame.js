import React, { useState, useEffect } from "react";
import { Box, Snackbar } from "@mui/material";
import { useStytchUser } from "@stytch/react";
import { useNavigate } from "react-router-dom";
import {
logGameStarted,
logGameEnded,
logGameShared,
} from "../../../analytics";
import GameGrid from "./GameBoard/GameGrid";
import Keyboard from "./GameBoard/Keyboard";
import GameHeader from "./GameBoard/GameHeader";
import GameControls from "./GameBoard/GameControls";
import GameOver from "./GameBoard/GameOver";
import LockedContent from "./LockedContent";

const BaseWordyGame = ({
  title,
  iconPath,
  subtitle,
  shareText,
  shareUrl,
  getWordForDate,
  findLatestAvailableDate,
}) => {
  const { user } = useStytchUser();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(null);
  const [wordData, setWordData] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isGuessFocused, setIsGuessFocused] = useState(false);

  const isDateLocked = (date) => {
    if (user) return false;
    const gameDate = new Date(date);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - gameDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays > 7;
  };

  // Initial game setup
  useEffect(() => {
    const latestWordData = findLatestAvailableDate();
    if (latestWordData) {
      const ptDate = new Date(latestWordData.date + "T00:00:00-08:00");
      setCurrentDate(ptDate);
      setWordData(latestWordData);
    }
  }, []);

  // Handle date changes
  useEffect(() => {
    if (!currentDate) return;

    const data = getWordForDate(currentDate);
    if (!data) {
      const latestWordData = findLatestAvailableDate();
      if (latestWordData) {
        setCurrentDate(new Date(latestWordData.date));
        setWordData(latestWordData);
      }
      return;
    }

    setWordData(data);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setShowHint(false);
  }, [currentDate]);

  const handleGuessUpdate = (key) => {
    if (!wordData || gameOver) return;

    const dateStr = currentDate.toLocaleDateString("en-US");

    if (key === "ENTER" && currentGuess.length === wordData.word.length) {
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);

      if (newGuesses.length === 1) {
        logGameStarted(title, {
          won: true,
          word: wordData.word,
          date: dateStr,
        });
      }

      if (currentGuess.toUpperCase() === wordData.word.toUpperCase()) {
        setGameOver(true);
        setCurrentGuess("");
        logGameEnded(title, {
          won: true,
          attempts: newGuesses.length,
          word: wordData.word,
          date: dateStr,
        });
        return;
      }

      if (newGuesses.length >= 5) {
        setGameOver(true);
        logGameEnded(title, {
          won: false,
          attempts: newGuesses.length,
          word: wordData.word,
          date: dateStr,
        });
      }

      setCurrentGuess("");
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < wordData.word.length) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const changeDate = (increment) => {
    if (!currentDate) return;

    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + increment);

    const newWordData = getWordForDate(newDate);
    if (newWordData && newWordData.date) {
      const ptDate = new Date(newWordData.date + "T00:00:00-08:00");
      setCurrentDate(ptDate);
    }
  };

  const handleShare = () => {
    const dateStr = currentDate.toLocaleDateString("en-US");
    const attemptCount = guesses.length;
    const won =
      guesses[guesses.length - 1].toUpperCase() === wordData.word.toUpperCase();

    let shareString = `${shareText} ${dateStr} ${
      won ? attemptCount : "X"
    }/5\n\n`;
    shareString += guesses
      .map((guess) =>
        Array.from(guess)
          .map((letter, i) => getShareEmoji(letter, i, wordData.word))
          .join("")
      )
      .join("\n");
    shareString += `\n\nPlay at: ${shareUrl}`;

    navigator.clipboard
      .writeText(shareString)
      .then(() => {
        setShowShareToast(true);
        logGameShared(title, {
          won: won,
          attempts: attemptCount,
          word: wordData.word,
          date: dateStr,
        });
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const getLetterBGColor = (letter, index, isGuessed) => {
    if (!isGuessed || !wordData) return "white";
    if (letter.toUpperCase() === wordData.word[index].toUpperCase())
      return "#B4D5A7";
    if (wordData.word.toUpperCase().includes(letter.toUpperCase()))
      return "#F5DEB3";
    return "#d3d6da";
  };

  const getShareEmoji = (letter, index, word) => {
    if (letter.toUpperCase() === word[index].toUpperCase()) return "🟩";
    if (word.toUpperCase().includes(letter.toUpperCase())) return "🟨";
    return "⬛";
  };

  if (!wordData) return null;

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        position: "relative",
      }}
    >

      <Box>
        <GameHeader title={title} subtitle={subtitle} iconPath={iconPath} />

        <GameControls
          currentDate={currentDate}
          onDateChange={changeDate}
          showHint={showHint}
          onHintToggle={() => setShowHint(!showHint)}
          wordData={wordData}
        />

        {isDateLocked(wordData.date) ? (
          <LockedContent onSignUp={() => navigate("/wordy-verse/auth")} />
        ) : (
          <>
            <GameGrid
              wordData={wordData}
              guesses={guesses}
              currentGuess={currentGuess}
              getLetterBGColor={getLetterBGColor}
            />

            <Keyboard
              onGuessUpdate={handleGuessUpdate}
              currentGuess={currentGuess}
              wordData={wordData}
              gameOver={gameOver}
              isGuessFocused={isGuessFocused}
              isLocked={false}
              guesses={guesses}
            />

            {gameOver && (
              <GameOver
                guesses={guesses}
                wordData={wordData}
                onShare={handleShare}
              />
            )}
          </>
        )}

        <Snackbar
          open={showShareToast}
          autoHideDuration={3000}
          onClose={() => setShowShareToast(false)}
          message="Results copied to clipboard!"
        />
      </Box>
    </Box>
  );
};

export default BaseWordyGame;