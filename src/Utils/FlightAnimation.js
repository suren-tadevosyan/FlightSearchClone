import React from "react";
import Lottie from "react-lottie";
import planeAnimationData from "./flight.json";

export const FlightAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: planeAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={150} width={150} />;
};
