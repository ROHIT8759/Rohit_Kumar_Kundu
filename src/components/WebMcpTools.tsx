import { useEffect } from "react";

type SectionId = "landingDiv" | "about" | "work" | "contact" | "social";

const SECTION_LABELS: Record<SectionId, string> = {
  landingDiv: "Landing",
  about: "About",
  work: "Work",
  contact: "Contact",
  social: "Social",
};

const scrollToSection = (sectionId: SectionId) => {
  const element = document.getElementById(sectionId);
  if (!element) {
    return { ok: false, error: `Section not found: ${sectionId}` };
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
  return { ok: true, sectionId, label: SECTION_LABELS[sectionId] };
};

export default function WebMcpTools() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("modelContext" in navigator)) {
      return;
    }

    const modelContext = (navigator as Navigator & { modelContext?: { registerTool: Function } }).modelContext;
    if (!modelContext) return;

    const abortController = new AbortController();

    modelContext.registerTool(
      {
        name: "scroll_to_section",
        title: "Scroll to section",
        description: "Scroll the page to a specific portfolio section.",
        inputSchema: {
          type: "object",
          properties: {
            sectionId: {
              type: "string",
              enum: Object.keys(SECTION_LABELS),
              description: "Section to bring into view.",
            },
          },
          required: ["sectionId"],
          additionalProperties: false,
        },
        execute: async (input: any) => {
          const sectionId = input.sectionId as SectionId;
          return scrollToSection(sectionId);
        },
        annotations: {
          readOnlyHint: true,
        },
      },
      { signal: abortController.signal }
    );

    return () => {
      abortController.abort();
    };
  }, []);

  return null;
}