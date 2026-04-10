import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

type AnalyticsAction = "start" | "heartbeat" | "end";

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

type NavigatorWithExtras = Navigator & {
  deviceMemory?: number;
  connection?: {
    type?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
};

const ENDPOINT = "/api/analytics";

const createVisitId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `visit_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const getGeoIfAlreadyAllowed = async (): Promise<{ latitude?: number; longitude?: number }> => {
  if (typeof navigator === "undefined" || !navigator.geolocation || !("permissions" in navigator)) {
    return {};
  }

  try {
    const permission = await navigator.permissions.query({ name: "geolocation" });
    if (permission.state !== "granted") {
      return {};
    }

    return await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => resolve({}),
        { maximumAge: 300000, timeout: 1500 }
      );
    });
  } catch {
    return {};
  }
};

const buildClientMetadata = async (): Promise<Omit<AnalyticsPayload, "action" | "visitId" | "path" | "url" | "durationMs" | "eventCountDelta">> => {
  const nav = navigator as NavigatorWithExtras;
  const geo = await getGeoIfAlreadyAllowed();

  return {
    referrer: document.referrer || undefined,
    userAgent: nav.userAgent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    language: nav.language,
    languages: nav.languages ? [...nav.languages] : undefined,
    platform: nav.platform,
    deviceMemoryGb: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    touchPoints: nav.maxTouchPoints,
    cookieEnabled: nav.cookieEnabled,
    doNotTrack: nav.doNotTrack || undefined,
    online: nav.onLine,
    connectionType: nav.connection?.type,
    effectiveType: nav.connection?.effectiveType,
    downlinkMbps: nav.connection?.downlink,
    rttMs: nav.connection?.rtt,
    latitude: geo.latitude,
    longitude: geo.longitude,
    clientTimestamp: new Date().toISOString(),
  };
};

const postPayload = (payload: AnalyticsPayload, preferBeacon: boolean) => {
  const body = JSON.stringify(payload);

  if (preferBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(ENDPOINT, blob);
    return;
  }

  void fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
};

export default function AnalyticsTracker() {
  const router = useRouter();
  const visitIdRef = useRef<string>(createVisitId());
  const startedAtRef = useRef<number>(Date.now());
  const metadataRef = useRef<Omit<AnalyticsPayload, "action" | "visitId" | "path" | "url" | "durationMs" | "eventCountDelta"> | null>(null);

  useEffect(() => {
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    let ended = false;

    const send = (action: AnalyticsAction, preferBeacon = false) => {
      const durationMs = Math.max(0, Date.now() - startedAtRef.current);
      const payload: AnalyticsPayload = {
        action,
        visitId: visitIdRef.current,
        path: router.asPath,
        url: window.location.href,
        durationMs,
        eventCountDelta: 1,
        ...(metadataRef.current ?? {}),
      };

      postPayload(payload, preferBeacon);
    };

    const endVisit = () => {
      if (ended) return;
      ended = true;
      send("end", true);
    };

    const startTracking = async () => {
      metadataRef.current = await buildClientMetadata();
      send("start");

      heartbeatTimer = setInterval(() => {
        if (document.visibilityState === "visible") {
          send("heartbeat");
        }
      }, 15000);
    };

    void startTracking();

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        endVisit();
      }
    };

    window.addEventListener("pagehide", endVisit);
    window.addEventListener("beforeunload", endVisit);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", endVisit);
      window.removeEventListener("beforeunload", endVisit);
      endVisit();
    };
  }, [router.asPath]);

  return null;
}
