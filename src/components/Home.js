import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FeaturedMobileGame from './FeaturedMobileGame';
import GameButton from './GameButton';
import CollapsibleSEOContent from './CollapsibleSEOContent';
import GamesBody from './GamesBody';
import { Helmet } from 'react-helmet';

const Home = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflowX: 'hidden',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Helmet>
        <title>Online Puzzle Games | Flying Comet Games - NYT Games Alternative</title>
        <meta name="description" content="Enjoy engaging online puzzle games, word games, and casual games similar to NYT Games. Challenge yourself with our collection of brain teasers and addictive puzzles." />
      </Helmet>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
          py: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '100%', // Ensure container does not exceed screen width
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            maxWidth: '600px',
            textAlign: 'left',
            mb: { xs: 3, sm: 4, md: 5 },
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Feel-good games for insiders.
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.25rem', md: '1.5rem' },
              pb: 2,
              fontWeight: 400,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            Kick back with our curated collection of mini-games that put your local knowledge to the test.
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: "sm",
            display: 'flex',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden', // Prevent horizontal overflow from content
          }}
        >
          <GamesBody />
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2024 Flying Comet Games. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Connect with us: <Link to="https://twitter.com/CalliFuch" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.primary.light }}>Calli</Link> and <Link to="https://twitter.com/EntreEden" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.primary.light }}>Eden</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
