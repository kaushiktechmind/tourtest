/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // output: "export",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};


module.exports = nextConfig;
