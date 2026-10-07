import type {NextConfig} from 'next';

// Bluehost shared hosting has no Node runtime: every page is pre-rendered to
// static HTML in `out/`, and server work happens in PHP under `public/api/`.
// NEXT_BASE_PATH is only set for the GitHub Pages preview, which lives under /pamsika.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {unoptimized: true},
  poweredByHeader: false,
  basePath: process.env.NEXT_BASE_PATH || undefined,
};

export default nextConfig;
