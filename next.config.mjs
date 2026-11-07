/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Set by the Next.js security upgrade (16.4.0 -> 16.4.5) on 2026-11-07.
    agentUpgrade: "security",
  },
};

export default nextConfig;
