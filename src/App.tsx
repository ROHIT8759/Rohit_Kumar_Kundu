import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import MainContainer from "./components/MainContainer";
import { LoadingProvider } from "./context/LoadingProvider";
import { initialFX } from "./components/utils/initialFX";

const CharacterFallback = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
    }}
  />
);

const CharacterModel = dynamic(() => import("./components/Character"), {
  ssr: false,
  loading: () => <CharacterFallback />,
});

const FullPageFallback = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      color: "#5eead4",
      background: "#050810",
      fontSize: "14px",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
    }}
  >
    Loading experience...
  </div>
);

const App = () => {
  const [load3D, setLoad3D] = useState(false);

  useEffect(() => {
    // Run the GSAP intro animations and re-enable scrolling
    setTimeout(() => {
      initialFX();
    }, 100);

    // Delay loading the heavy 3D model until after hydration and critical rendering.
    // Gives the browser time to paint the HTML/CSS first.
    const timer = setTimeout(() => {
      setLoad3D(true);
    }, 1500); // 1.5s delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<CharacterFallback />}>
          <MainContainer>
            {load3D ? <CharacterModel /> : <CharacterFallback />}
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
