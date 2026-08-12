import type { NextApiRequest, NextApiResponse } from "next";
import { getSiteUrl } from "../../../src/lib/siteUrl";

const handler = function (_req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = getSiteUrl();

  const linkset = {
    linkset: [
      {
        anchor: `${siteUrl}/api/analytics`,
        "service-desc": [
          { href: `${siteUrl}/openapi.json`, type: "application/json" },
        ],
        "service-doc": [
          { href: `${siteUrl}/docs/api`, type: "text/html" },
        ],
        status: [
          { href: `${siteUrl}/api/health`, type: "application/json" },
        ],
      },
      {
        anchor: `${siteUrl}/api/health`,
        "service-desc": [
          { href: `${siteUrl}/openapi.json`, type: "application/json" },
        ],
        "service-doc": [
          { href: `${siteUrl}/docs/api`, type: "text/html" },
        ],
        status: [
          { href: `${siteUrl}/api/health`, type: "application/json" },
        ],
      },
    ],
  };

  res.setHeader(
    "Content-Type",
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'
  );
  res.status(200).json(linkset);
};

export default handler as any;