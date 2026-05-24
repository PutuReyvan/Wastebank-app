/**
 * Subdomain routing helper.
 *
 * Public site:
 *   https://banksampah.id
 *
 * Admin panel:
 *   https://admin.banksampah.id
 *
 * Set REACT_APP_ADMIN_URL when the deployed admin URL cannot be inferred from
 * the current public hostname.
 */

const ADMIN_PREFIX = "admin.";
const DEFAULT_PRODUCTION_ADMIN_URL = "https://admin.banksampah.id";
const DEFAULT_LOCAL_ADMIN_URL = "http://127.0.0.1:8001/admin";

export function isAdminSubdomain() {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith(ADMIN_PREFIX);
}

export function adminHostUrl() {
  const configured = process.env.REACT_APP_ADMIN_URL;
  if (configured) return configured;
  if (typeof window === "undefined") return DEFAULT_PRODUCTION_ADMIN_URL;

  const { protocol, hostname } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return DEFAULT_LOCAL_ADMIN_URL;
  }

  const root = hostname.startsWith(ADMIN_PREFIX)
    ? hostname.slice(ADMIN_PREFIX.length)
    : hostname;

  return `${protocol}//${ADMIN_PREFIX}${root}`;
}

export function publicHostUrl() {
  if (typeof window === "undefined") return "/";
  const { protocol, hostname, port } = window.location;
  const stripped = hostname.startsWith(ADMIN_PREFIX)
    ? hostname.slice(ADMIN_PREFIX.length)
    : hostname;
  return `${protocol}//${stripped}${port ? `:${port}` : ""}`;
}
