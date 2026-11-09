import type { APIRoute } from "astro";
import { site } from "@/config/site";
import { routes } from "@/i18n/ui";

/**
 * iOS Universal Links: lets a tap on a ryvexstudio.com product link open the installed iPhone app.
 * Only products with a bundle ID are listed, and only once the Apple Team ID is set; until then the
 * list is empty, which is valid and opens nothing.
 */
export const GET: APIRoute = () => {
  const { appleTeamId, iosApps } = site.integrations;
  const details = appleTeamId
    ? iosApps
        .filter((app) => app.bundleId)
        .map((app) => ({
          appIDs: [`${appleTeamId}.${app.bundleId}`],
          components: [
            { "/": `${routes.products.tr}/${app.product}` },
            { "/": `${routes.products.en}/${app.product}` },
          ],
        }))
    : [];
  return new Response(JSON.stringify({ applinks: { details } }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};
