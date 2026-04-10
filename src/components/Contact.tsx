import { MdArrowOutward, MdCopyright } from "react-icons/md";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="https://www.linkedin.com/in/rohit-kumar-kundu/"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — rohit-kumar-kundu
              </a>
            </p>
            <h4>Education</h4>
            <p>
              B.Tech, CSE — Sister Nivedita University
            </p>
            <p>
              MM High School Purulia — Higher Secondary
            </p>
            <p>
              Chittaranjan High School — Secondary
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/ROHIT8759"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/rohit-kumar-kundu/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="https://x.com/ROHIT_Kr_KUNDU"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              X (Twitter) <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/rohit_kumar_kundu/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
            <a
              href="tel:+917908655084"
              data-cursor="disable"
              className="contact-social"
            >
              Call: +91 7908655084 <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Rohit Kumar Kundu</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
