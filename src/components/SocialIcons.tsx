import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement | null;
    if (!social) return;

    let rafId = 0;
    let pageVisible = !document.hidden;

    type ItemState = {
      elem: HTMLElement;
      link: HTMLElement;
      rect: DOMRect;
      mouseX: number;
      mouseY: number;
      currentX: number;
      currentY: number;
      hovered: boolean;
      onMouseEnter: () => void;
      onMouseLeave: () => void;
      onMouseMove: (e: MouseEvent) => void;
    };

    const itemStates: ItemState[] = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement | null;
      if (!link) return;

      const rect = elem.getBoundingClientRect();

      const state: ItemState = {
        elem,
        link,
        rect,
        mouseX: rect.width / 2,
        mouseY: rect.height / 2,
        currentX: rect.width / 2,
        currentY: rect.height / 2,
        hovered: false,
        onMouseEnter: () => {
          state.hovered = true;
          state.rect = elem.getBoundingClientRect();
        },
        onMouseLeave: () => {
          state.hovered = false;
          state.mouseX = state.rect.width / 2;
          state.mouseY = state.rect.height / 2;
        },
        onMouseMove: (e: MouseEvent) => {
          if (!state.hovered) return;
          const x = e.clientX - state.rect.left;
          const y = e.clientY - state.rect.top;
          state.mouseX = Math.max(0, Math.min(state.rect.width, x));
          state.mouseY = Math.max(0, Math.min(state.rect.height, y));
        },
      };

      elem.addEventListener("mouseenter", state.onMouseEnter);
      elem.addEventListener("mouseleave", state.onMouseLeave);
      elem.addEventListener("mousemove", state.onMouseMove);
      itemStates.push(state);
    });

    const onResize = () => {
      itemStates.forEach((state) => {
        state.rect = state.elem.getBoundingClientRect();
      });
    };

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
    };

    const animate = () => {
      if (pageVisible) {
        itemStates.forEach((state) => {
          state.currentX += (state.mouseX - state.currentX) * 0.15;
          state.currentY += (state.mouseY - state.currentY) * 0.15;

          state.link.style.setProperty("--siLeft", `${state.currentX}px`);
          state.link.style.setProperty("--siTop", `${state.currentY}px`);
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      itemStates.forEach((state) => {
        state.elem.removeEventListener("mouseenter", state.onMouseEnter);
        state.elem.removeEventListener("mouseleave", state.onMouseLeave);
        state.elem.removeEventListener("mousemove", state.onMouseMove);
      });
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href="https://github.com/LK011R750"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://www.linkedin.com/in/rohit-kumar-kundu"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a
            href="https://github.com/LK011R750"
            target="_blank"
            rel="noreferrer"
          >
            <FaYoutube />
          </a>
        </span>
        <span>
          <a
            href="https://www.linkedin.com/in/rohit-kumar-kundu"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href="https://www.linkedin.com/in/rohit-kumar-kundu"
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
