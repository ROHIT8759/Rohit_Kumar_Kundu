export default function ApiDocsPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
      <h1>Portfolio API Documentation</h1>
      <p>
        This site exposes a small JSON API used for analytics and health checks.
        Use the OpenAPI document for schema details.
      </p>

      <section>
        <h2>Endpoints</h2>
        <ul>
          <li>
            <strong>POST /api/analytics</strong> — Store a visit analytics event.
          </li>
          <li>
            <strong>GET /api/health</strong> — Health check for uptime monitoring.
          </li>
        </ul>
      </section>

      <section>
        <h2>Resources</h2>
        <ul>
          <li>
            <a href="/openapi.json">OpenAPI specification</a>
          </li>
          <li>
            <a href="/.well-known/api-catalog">API catalog</a>
          </li>
        </ul>
      </section>
    </main>
  );
}