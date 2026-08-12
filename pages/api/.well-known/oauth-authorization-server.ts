import type { NextApiRequest, NextApiResponse } from "next";
import { getSiteUrl } from "../../../src/lib/siteUrl";

const handler = function (_req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = getSiteUrl();

  const metadata = {
    issuer: siteUrl,
    authorization_endpoint: `${siteUrl}/api/oauth/authorize`,
    token_endpoint: `${siteUrl}/api/oauth/token`,
    jwks_uri: `${siteUrl}/api/oauth/jwks`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    token_endpoint_auth_methods_supported: ["client_secret_basic"],
    service_documentation: `${siteUrl}/docs/api`,
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json(metadata);
};

export default handler as any;