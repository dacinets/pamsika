import type {NextConfig} from 'next';

// Bluehost shared hosting has no Node runtime: every page is pre-rendered to
// static HTML in `out/`, and server work happens in PHP under `public/api/`.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {unoptimized: true},
  poweredByHeader: false,
};

export default nextConfig;
