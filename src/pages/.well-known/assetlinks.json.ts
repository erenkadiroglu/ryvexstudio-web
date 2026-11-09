import type { APIRoute } from "astro";
import { site } from "@/config/site";

/**
 * Android App Links: lets a tap on a ryvexstudio.com product link open the installed app.
 * Only apps with a Play app-signing fingerprint are listed; with none, an empty list is valid.
 */
export const GET: APIRoute = () => {
  const statements = site.integrations.androidApps
    .filter((app) => app.fingerprints.length > 0)
    .map((app) => ({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", package_name: app.package, sha256_cert_fingerprints: app.fingerprints },
    }));
  return new Response(JSON.stringify(statements, null, 2), { headers: { "Content-Type": "application/json" } });
};
