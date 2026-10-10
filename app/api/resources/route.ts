import { HELPLINES } from "@/lib/helplines";

/**
 * The curated helpline list, served so the Expo app can render the same numbers
 * as the web app instead of keeping a second copy that silently drifts.
 *
 * This is public information and contains nothing user-specific. It is
 * generated at build time; each client still ships a tiny offline fallback for
 * the few numbers that matter in an emergency, because a safety screen must
 * work with no network.
 */
export async function GET() {
  return Response.json(
    {
      ok: true,
      verifiedAt: "see verifiedAgainst on each entry",
      helplines: HELPLINES,
    },
    { headers: { "cache-control": "public, max-age=3600, s-maxage=86400" } },
  );
}
