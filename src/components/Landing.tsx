import { PropsWithChildren } from "react";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I&apos;m</h2>
            <h1>
              ROHIT
              <br />
              <span> KUMAR KUNDU</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>CSE Student &</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Web</div>
              <div className="landing-h2-2">Backend</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Builder</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
