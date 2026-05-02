import type { NextApiRequest, NextApiResponse } from "next";
import { getSiteUrl } from "../../src/lib/siteUrl";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = getSiteUrl();

  const metadata = {
    resource: siteUrl,
    authorization_servers: [siteUrl],
    scopes_supported: [],
    bearer_methods_supported: ["header"],
    resource_documentation: `${siteUrl}/docs/api`,
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json(metadata);
}