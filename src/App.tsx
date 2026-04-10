import { lazy, Suspense } from "react";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

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

const CharacterFallback = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
    }}
  />
);

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<FullPageFallback />}>
          <MainContainer>
            <Suspense fallback={<CharacterFallback />}>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
