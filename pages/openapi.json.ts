import type { NextApiRequest, NextApiResponse } from "next";
import { getSiteUrl } from "../src/lib/siteUrl";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = getSiteUrl();

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Portfolio Analytics API",
      version: "1.0.0",
      description: "Analytics collection endpoints for the portfolio site.",
    },
    servers: [{ url: siteUrl }],
    paths: {
      "/api/analytics": {
        post: {
          summary: "Capture analytics event",
          description: "Stores a visit analytics event.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    action: { type: "string", enum: ["start", "heartbeat", "end"] },
                    visitId: { type: "string" },
                    path: { type: "string" },
                    url: { type: "string" },
                    referrer: { type: "string" },
                    userAgent: { type: "string" },
                    clientTimestamp: { type: "string", format: "date-time" },
                  },
                  required: ["action", "visitId", "path", "url"],
                  additionalProperties: true,
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Event stored",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      action: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": { description: "Invalid request" },
            "500": { description: "Server error" },
          },
        },
      },
      "/api/health": {
        get: {
          summary: "Health check",
          responses: {
            "200": {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json(spec);
}