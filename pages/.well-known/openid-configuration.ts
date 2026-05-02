import type { NextApiRequest, NextApiResponse } from "next";
import { getSiteUrl } from "../../src/lib/siteUrl";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = getSiteUrl();

  const metadata = {
    issuer: siteUrl,
    authorization_endpoint: `${siteUrl}/api/oauth/authorize`,
    token_endpoint: `${siteUrl}/api/oauth/token`,
    jwks_uri: `${siteUrl}/api/oauth/jwks`,
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid"],
    service_documentation: `${siteUrl}/docs/api`,
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json(metadata);
}