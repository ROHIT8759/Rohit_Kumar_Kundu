import { PropsWithChildren, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import setSplitText from "./utils/splitText";

const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const About = dynamic(() => import("./About"), { ssr: false });
const WhatIDo = dynamic(() => import("./WhatIDo"), { ssr: false });
const Career = dynamic(() => import("./Career"), { ssr: false });
const Work = dynamic(() => import("./Work"), { ssr: false });
const TechStack = dynamic(() => import("./TechStack"), { ssr: false });
const Contact = dynamic(() => import("./Contact"), { ssr: false });

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(true); // Default to true for SSR, update on mount

  useEffect(() => {
    setIsDesktopView(window.innerWidth > 1024);
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {/* Desktop 3D Canvas */}
      <div className="desktop-character-wrapper">
        {children}
      </div>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>
              {/* Mobile 3D Canvas */}
              <div className="mobile-character-wrapper">
                {children}
              </div>
            </Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            <div className="desktop-techstack-wrapper">
              <TechStack />
            </div>
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
