/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  experimental: {
    appDir: true,
    mdxRs: true,
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
};

const withMDX = require('@next/mdx')();
module.exports = withMDX(nextConfig);
