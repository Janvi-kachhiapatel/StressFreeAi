import { headers } from "next/headers";
import { activeProvider } from "@/lib/ai/provider";
import { rateLimitStore } from "@/lib/rateLimit";

/**
 * Reports which backend is live so the UI can be honest with the user about
 * running in demo mode. Never exposes keys or configuration values.
 *
 * Note: this project has Cache Components enabled, which forbids route segment
 * config such as `dynamic = "force-dynamic"`. Touching a runtime API
 * (`headers()`) is the supported way to opt a GET handler out of prerendering,
 * so the provider is read per request rather than baked at build time.
 */
export async function GET() {
  await headers();

  const provider = activeProvider();
  return Response.json(
    {
      ok: true,
      provider: { label: provider.label, model: provider.model },
      demo: provider.demo,
      safetyLayer: "deterministic-triage-v1",
      rateLimitStore,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
