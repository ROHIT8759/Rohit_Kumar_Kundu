import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const NAV_LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "CONTACT", href: "#contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const el = e.currentTarget as HTMLAnchorElement;
          const section = el.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
        setMenuOpen(false);
      });
    });

    const handleResize = () => ScrollSmoother.refresh(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <>
      <div className="header" ref={menuRef}>
        <Link href="/" className="navbar-title" data-cursor="disable">
          RK
        </Link>

        <a
          href="https://www.linkedin.com/in/rohit-kumar-kundu"
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          linkedin.com/in/rohit-kumar-kundu
        </a>

        {/* Desktop nav */}
        <ul className="navbar-links">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a data-href={href} href={href}>
                <HoverLinks text={label} />
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger button (mobile only) */}
        <button
          className={`hamburger${menuOpen ? " hamburger--open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          data-cursor="disable"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown */}
      <nav className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`}>
        <ul>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                data-href={href}
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                <HoverLinks text={label} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="landing-circle1" />
      <div className="landing-circle2" />
      <div className="nav-fade" />
    </>
  );
};

export default Navbar;
