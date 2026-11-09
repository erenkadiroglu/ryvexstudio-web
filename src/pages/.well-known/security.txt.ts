import type { APIRoute } from "astro";
import { site } from "@/config/site";

/**
 * security.txt (RFC 9116): how to report a security problem. The address follows the contact
 * settings in the panel; the file is renewed with every build and stays valid for a year.
 */
export const GET: APIRoute = () => {
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  const body = [
    `Contact: mailto:${site.contactEmail}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, ".000Z")}`,
    "Preferred-Languages: tr, en",
    `Canonical: ${site.url}/.well-known/security.txt`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
