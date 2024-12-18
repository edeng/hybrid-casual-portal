import React, { useEffect, useState, useRef } from "react";
import { Adsense } from "@ctrl/react-adsense";
import { Box } from "@mui/material";

const GoogleAd = ({
  slot,
  onAdBlocked,
  onAdLoaded,
  horizontalImage = `${process.env.PUBLIC_URL}/assets/adblock-horizontal.png`,
  verticalImage = `${process.env.PUBLIC_URL}/assets/adblock-vertical.jpg`,
  fallbackImageAlt = "Alternative content",
}) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const adContainerRef = useRef(null);

  useEffect(() => {
    const checkAdBlock = () => {
      const isAdEmpty =
        !adContainerRef.current?.querySelector("ins.adsbygoogle");
      const isAdHidden = adContainerRef.current?.offsetHeight === 0;

      if (isAdEmpty || isAdHidden) {
        setIsBlocked(true);
        onAdBlocked?.();
      }
    };

    const loadAdsense = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        if (
          e.message &&
          e.message.includes(
            "All 'ins' elements in the DOM with class=adsbygoogle already have ads in them."
          )
        ) {
          // Ignore this specific error since it indicates ads are already loaded
          console.log("AdSense is already loaded.");
        } else {
          console.log("AdSense error:", e);
          setIsBlocked(true);
          onAdBlocked?.();
        }
      }
    };

    window.addEventListener("load", loadAdsense);
    const timeoutId = setTimeout(checkAdBlock, 2000);

    return () => {
      window.removeEventListener("load", loadAdsense);
      clearTimeout(timeoutId);
    };
  }, [onAdBlocked]);

  const handleAdLoad = () => {
    setIsBlocked(false); // Reset isBlocked if the ad successfully loads
    onAdLoaded?.();
  };

  return (
    <Box ref={adContainerRef}>
      {isBlocked ? (
        <Box position="relative">
          {/* Vertical fallback for smaller screens, horizontal for medium and up */}
          <Box
            component="img"
            src={verticalImage}
            alt={fallbackImageAlt}
            sx={{
              display: { xs: "block", sm: "none" },
              width: "100%",
              height: "auto",
            }}
          />
          <Box
            component="img"
            src={horizontalImage}
            alt={fallbackImageAlt}
            sx={{
              display: { xs: "none", sm: "block" },
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
      ) : (
        <Adsense
          className="adsbygoogle"
          client="ca-pub-1729981660160138"
          slot={slot}
          format="auto"
          style={{ display: "block", maxHeight: "150px", maxWidth: "100%" }}
          responsive="true"
          onLoad={handleAdLoad} // Use handleAdLoad instead of directly onLoad
        />
      )}
    </Box>
  );
};

export default GoogleAd;
