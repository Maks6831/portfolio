// Security headers for every route. The CSP has no nonces because every page is prerendered (nonces need dynamic
// rendering), so inline scripts are allowed: Next's flight data and the loader from scripts/defer-scripts.mjs are
// inline. Everything else (fonts, images, scripts) is same-origin. `next dev` needs eval for React's debugging.
const isDev = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // 75 is Next's default. 60 is for the home hero only: the live-site photo must stay under the 60 kB LCP budget
    // at the mobile candidate (scripts/check-images.mjs); screenshots of UI keep 75 so their text stays crisp.
    qualities: [60, 75],
  },
  experimental: {
    // Set by the Next.js security upgrade (16.4.0 -> 16.4.5) on 2026-11-07.
    agentUpgrade: "security",
  },
};

export default nextConfig;
