import type { NextApiRequest, NextApiResponse } from "next";
import { getSiteUrl } from "../../src/lib/siteUrl";

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "Claude-Web",
  "Google-Extended",
  "Amazonbot",
  "anthropic-ai",
  "Bytespider",
  "CCBot",
  "Applebot-Extended",
];

const buildGroup = (userAgent: string) => [
  `User-agent: ${userAgent}`,
  "Allow: /",
  "Disallow: /api/",
  "Disallow: /_next/",
  "Content-Signal: ai-train=no, search=yes, ai-input=no",
  "",
];

const handler = function (_req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = getSiteUrl();

  const lines = [
    ...buildGroup("*"),
    ...AI_BOTS.flatMap((bot) => buildGroup(bot)),
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ];

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(lines.join("\n").trimEnd() + "\n");
};

export default handler as any;