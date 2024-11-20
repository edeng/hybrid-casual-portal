import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet";
import { useStytchUser } from "@stytch/react";
import TopicsBody from "../WordyVerse/TopicsBody";
import TriviaRoundupTopicsBody from "./TopicsBody";

const TriviaRoundup = () => {
  const theme = useTheme();
  const { user } = useStytchUser();

  // Function to check if a game should be locked
  const isGameLocked = (gameDate) => {
    if (user) return false; // Always unlocked for logged-in users

    const currentDate = new Date();
    const gameDateTime = new Date(gameDate);
    const differenceInTime = currentDate.getTime() - gameDateTime.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays > 7;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowX: "hidden",
        backgroundColor: 'background.default',
      }}
    >
      <Helmet>
        <title>Wordy Verse</title>
        <meta
          name="description"
          content="Enjoy engaging online puzzle games, word games, and casual games similar to NYT Games. Challenge yourself with our collection of brain teasers and addictive puzzles."
        />
      </Helmet>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
          py: { xs: 2, sm: 3, md: 4 },
          maxWidth: "1024px",
          mx: 'auto',
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            maxWidth: "600px",
            textAlign: "left",
            mb: { xs: 3, sm: 4, md: 5 },
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              pb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            Ultra-niche trivia for super fans, inside jokes, and subject matter experts.
          </Typography>
        </Box>

        {/* {!user && <LoginButtons />} */}

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <TriviaRoundupTopicsBody isGameLocked={isGameLocked} isLoggedIn={!!user} />
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: "auto",
          borderTop: "1px solid",
          borderColor: "divider",
          textAlign: "center",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2024 Flying Comet Games. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default TriviaRoundup;