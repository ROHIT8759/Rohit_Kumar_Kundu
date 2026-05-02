import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const buildMarkdown = (origin: string) => `# Rohit Kumar Kundu — Portfolio

Welcome to Rohit's portfolio site. This page highlights projects, skills, and ways to get in touch.

## Key sections
- Landing
- About
- Work
- Contact
- Social

## Useful resources
- API catalog: ${origin}/.well-known/api-catalog
- API docs: ${origin}/docs/api
- OpenAPI spec: ${origin}/openapi.json
- Agent skills index: ${origin}/.well-known/agent-skills/index.json
- Sitemap: ${origin}/sitemap.xml
`;

const estimateTokens = (value: string) => Math.max(1, value.trim().split(/\s+/).length);

const linkHeaders = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi.json>; rel="service-desc"',
  '</docs/api>; rel="service-doc"',
  '</.well-known/agent-skills/index.json>; rel="describedby"',
].join(", ");

export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") || "";

  if (accept.includes("text/markdown")) {
    const origin = request.nextUrl.origin;
    const markdown = buildMarkdown(origin);

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
        "x-markdown-tokens": String(estimateTokens(markdown)),
        "Link": linkHeaders,
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Link", linkHeaders);
  response.headers.set("Vary", "Accept");
  return response;
}

export const config = {
  matcher: ["/"],
};