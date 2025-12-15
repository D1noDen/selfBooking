import { useState, useEffect } from "react"
export const GlobalHookWindowSummary = () => {
  const [screenSize, getDimension] = useState(window.innerWidth);
  const setDimension = () => {
    getDimension(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", setDimension);

    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [screenSize]);

  return { screenSize }
}

export const GlobalHookWindowHeight = () => {
  const [screenHeight, getScreenHeight] = useState(window.innerHeight);
  const setScreenHeight = () => {
    getScreenHeight(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener('resize', setScreenHeight);
    return () => {
      window.removeEventListener('resize', setScreenHeight);
    };
  }, [screenHeight]);

  return { screenHeight };
}