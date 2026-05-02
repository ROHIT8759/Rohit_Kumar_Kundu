import type { NextApiRequest, NextApiResponse } from "next";
import { getSiteUrl } from "../../../src/lib/siteUrl";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = getSiteUrl();

  const card = {
    serverInfo: {
      name: "rohits-portfolio",
      version: "1.0.0",
    },
    transport: {
      type: "http",
      endpoint: `${siteUrl}/mcp`,
    },
    capabilities: {
      tools: [],
      resources: [],
      prompts: [],
    },
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json(card);
}