import type { NextApiRequest, NextApiResponse } from "next";

const handler = function (_req: NextApiRequest, res: NextApiResponse) {
  res.status(501).json({ error: "MCP server not implemented." });
};

export default handler as any;