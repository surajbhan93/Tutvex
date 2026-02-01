// /* eslint-disable import/no-extraneous-dependencies */
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// /** @type {import('next').NextConfig} */
// module.exports = withBundleAnalyzer({
//   // ✅ VERY IMPORTANT FIX
//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   // 🔥 ADD THESE TWO LINES
//   swcMinify: false,
//   experimental: {
//     optimizeCss: false,
//   },

//   poweredByHeader: false,
//   trailingSlash: true,
//   basePath: "",
//   reactStrictMode: true,

//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3001",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// });

/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  eslint: {
    ignoreDuringBuilds: true,
  },

  swcMinify: false,
  experimental: {
    optimizeCss: false,
  },

  webpack(config, { dev }) {
    // 🔥 KILL ALL MINIFIERS IN PRODUCTION
    if (!dev) {
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    return config;
  },

  reactStrictMode: true,
  trailingSlash: true,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
    ],
  },
});

