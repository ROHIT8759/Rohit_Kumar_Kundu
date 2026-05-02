import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import path from "path";
import { promises as fs } from "fs";

const skillFilePath = path.join(
  process.cwd(),
  "public",
  ".well-known",
  "agent-skills",
  "site-info",
  "SKILL.md"
);

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const raw = await fs.readFile(skillFilePath);
  const digest = crypto.createHash("sha256").update(raw).digest("hex");

  const index = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "site-info",
        type: "skill-md",
        description:
          "Provide quick facts, key sections, and important links for Rohit Kumar Kundu's portfolio site.",
        url: "/.well-known/agent-skills/site-info/SKILL.md",
        digest: `sha256:${digest}`,
      },
    ],
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json(index);
}