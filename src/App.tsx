import dynamic from "next/dynamic";
import { Suspense } from "react";
import MainContainer from "./components/MainContainer";
import { LoadingProvider } from "./context/LoadingProvider";

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
  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<FullPageFallback />}>
          <MainContainer>
            <CharacterModel />
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
