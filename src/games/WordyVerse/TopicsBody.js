import React from "react";
import Grid from "@mui/material/Grid2";
import GameButton from "../../components/GameButton";
import GoogleAd from "./Components/GoogleAd";
import GoogleAdTopic from "./Components/GoogleAdTopic";
import FeaturedGame from "../../components/FeaturedGame";
import FeaturedTopic from "./FeaturedTopic";
import SignupButton from "./SignupButton";

const TopicsBody = () => {
  const wordyVerseBase = "/wordy-verse";

  const games = [
    {
      to: wordyVerseBase + "/accounting-wordle",
      title: "ACCOUNTING",
      logoSrc: "/assets/wordy-topics/accounting-wordle-icon.png",
    },
    {
      to: wordyVerseBase + "/nyt-guild-support",
      title: "NYT Guild",
      logoSrc: "/assets/wordy-topics/nyt-guild.svg",
    },
    {
      to: wordyVerseBase + "/boba-tea",
      title: "BOBA TEA",
      logoSrc: "/assets/wordy-topics/boba-tea.svg",
    },
    {
      to: wordyVerseBase + "/gymnastics",
      title: "GYMNASTICS",
      logoSrc: "/assets/wordy-topics/gymnastics.svg",
    },
    // {
    //   to: wordyVerseBase + "/seattle",
    //   title: "SEATTLE",
    //   logoSrc: "/assets/wordy-topics/seattle.svg",
    // },
    {
      to: wordyVerseBase + "/yoga",
      title: "YOGA",
      logoSrc: "/assets/wordy-topics/yoga.svg",
    },
    {
      to: wordyVerseBase + "/yc",
      title: "Y Combinator",
      logoSrc: "/assets/wordy-topics/yc.svg",
    },
    {
      to: wordyVerseBase + "/american-dad",
      title: "AMERICAN DAD",
      logoSrc: "/assets/wordy-topics/american-dad.svg",
    },
    {
      to: wordyVerseBase + "/survivor",
      title: "SURVIVOR",
      logoSrc: "/assets/wordy-topics/survivor.svg",
    },
    {
      to: wordyVerseBase + "/friends",
      title: "FRIENDS",
      logoSrc: "/assets/wordy-topics/friends.svg",
    },
    {
      to: wordyVerseBase + "/animal-crossing",
      title: "ANIMAL CROSSING",
      logoSrc: "/assets/wordy-topics/animal-crossing.svg",
    },
    {
      to: wordyVerseBase + "/occupational-therapy",
      title: "OT/PT",
      logoSrc: "/assets/wordy-topics/occupational-therapy.svg",
    },
    {
      to: wordyVerseBase + "/legal",
      title: "LEGAL",
      logoSrc: "/assets/wordy-topics/lawyer.svg",
    },
  ];

  return (
    <Grid container spacing={2} justifyContent="center" width="100%">

      <FeaturedTopic
        svgLogo="/assets/wordy-topics/seattle.svg"
        description="Explore puzzles inspired by the Emerald City!"
        title="Seattle"
        link="/wordy-verse/seattle"
        bgColor="#b8c26c"
      />

      <SignupButton />

      {games.map((game, index) => (
        <React.Fragment key={game.title}>
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
            <GameButton
              to={game.to}
              title={game.title}
              logoSrc={game.logoSrc}
              backgroundColor="#ffffff"
            />
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};
export default TopicsBody;
