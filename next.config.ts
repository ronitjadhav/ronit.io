import type { NextConfig } from 'next';

// Only use bundle analyzer for production builds (not with Turbopack)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'production',
});

const nextConfig: NextConfig = {
  // Static export configuration for GitHub Pages
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  
  // Enable experimental optimizations
  experimental: {
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      '@fortawesome/free-solid-svg-icons',
      'react-icons',
      'framer-motion',
    ],
  },
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Image optimization (adjusted for static export)
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable compression
  compress: true,
};

// Apply bundle analyzer only for production builds to avoid Turbopack conflicts
export default process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'production' 
  ? withBundleAnalyzer(nextConfig) 
  : nextConfig;
