/** @type {import('next').NextConfig} */
const nextConfig = {
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
