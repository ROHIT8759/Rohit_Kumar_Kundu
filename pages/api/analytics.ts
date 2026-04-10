import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../src/lib/prisma";

type AnalyticsAction = "start" | "heartbeat" | "end";

const prismaActionMap = {
  start: "START",
  heartbeat: "HEARTBEAT",
  end: "END",
} as const;

type AnalyticsPayload = {
  action: AnalyticsAction;
  visitId: string;
  path: string;
  url: string;
  referrer?: string;
  userAgent?: string;
  timezone?: string;
  timezoneOffset?: number;
  language?: string;
  languages?: string[];
  platform?: string;
  deviceMemoryGb?: number;
  hardwareConcurrency?: number;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  colorDepth?: number;
  pixelRatio?: number;
  touchPoints?: number;
  cookieEnabled?: boolean;
  doNotTrack?: string;
  online?: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlinkMbps?: number;
  rttMs?: number;
  latitude?: number;
  longitude?: number;
  durationMs?: number;
  eventCountDelta?: number;
  clientTimestamp?: string;
};

const getHeaderValue = (value: string | string[] | undefined): string | undefined => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

const getIpAddress = (req: NextApiRequest): { ipAddress?: string; forwardedFor?: string } => {
  const forwardedFor = getHeaderValue(req.headers["x-forwarded-for"]);
  const realIp = getHeaderValue(req.headers["x-real-ip"]);
  const cloudflareIp = getHeaderValue(req.headers["cf-connecting-ip"]);
  const ipAddress = forwardedFor?.split(",")[0]?.trim() || realIp || cloudflareIp || req.socket.remoteAddress;

  return {
    ipAddress,
    forwardedFor,
  };
};

const getGeoFromHeaders = (req: NextApiRequest) => ({
  country: getHeaderValue(req.headers["x-vercel-ip-country"]),
  region: getHeaderValue(req.headers["x-vercel-ip-country-region"]),
  city: getHeaderValue(req.headers["x-vercel-ip-city"]),
});

const sanitizeNumber = (value: unknown): number | undefined => {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return undefined;
  }
  return value;
};

const sanitizeInteger = (value: unknown): number | undefined => {
  const numeric = sanitizeNumber(value);
  if (numeric === undefined) return undefined;
  return Math.trunc(numeric);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.body as AnalyticsPayload;

  if (!payload?.visitId || !payload?.path || !payload?.url || !payload?.action) {
    return res.status(400).json({ error: "Missing required analytics fields" });
  }

  try {
    const { ipAddress, forwardedFor } = getIpAddress(req);
    const geo = getGeoFromHeaders(req);
    const now = new Date();
    const action = payload.action;

    const commonData = {
      path: payload.path,
      url: payload.url,
      referrer: payload.referrer,
      userAgent: payload.userAgent || req.headers["user-agent"],
      ipAddress,
      forwardedFor,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      latitude: sanitizeNumber(payload.latitude),
      longitude: sanitizeNumber(payload.longitude),
      timezone: payload.timezone,
      timezoneOffset: sanitizeInteger(payload.timezoneOffset),
      language: payload.language,
      languages: payload.languages,
      platform: payload.platform,
      deviceMemoryGb: sanitizeNumber(payload.deviceMemoryGb),
      hardwareConcurrency: sanitizeInteger(payload.hardwareConcurrency),
      screenWidth: sanitizeInteger(payload.screenWidth),
      screenHeight: sanitizeInteger(payload.screenHeight),
      viewportWidth: sanitizeInteger(payload.viewportWidth),
      viewportHeight: sanitizeInteger(payload.viewportHeight),
      colorDepth: sanitizeInteger(payload.colorDepth),
      pixelRatio: sanitizeNumber(payload.pixelRatio),
      touchPoints: sanitizeInteger(payload.touchPoints),
      cookieEnabled: typeof payload.cookieEnabled === "boolean" ? payload.cookieEnabled : undefined,
      doNotTrack: payload.doNotTrack,
      online: typeof payload.online === "boolean" ? payload.online : undefined,
      connectionType: payload.connectionType,
      effectiveType: payload.effectiveType,
      downlinkMbps: sanitizeNumber(payload.downlinkMbps),
      rttMs: sanitizeInteger(payload.rttMs),
      durationMs: sanitizeInteger(payload.durationMs),
      metadata: {
        clientTimestamp: payload.clientTimestamp,
      },
    };

    await prisma.visitorAnalytics.create({
      data: {
        visitId: payload.visitId,
        action: prismaActionMap[action],
        eventAt: now,
        startedAt: action === "start" ? now : undefined,
        endedAt: action === "end" ? now : undefined,
        ...commonData,
      },
    });

    return res.status(200).json({ ok: true, action });
  } catch (error) {
    console.error("Analytics API error:", error);
    return res.status(500).json({ error: "Failed to store analytics" });
  }
}
