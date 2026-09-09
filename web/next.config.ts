import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      // Instagram tiles imported from a post link, before they are mirrored
      // into Cloudinary — these URLs are signed and eventually expire
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
    ],
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      ...["/cart", "/checkout", "/order/:path*", "/account/:path*", "/auth/:path*"].map(
        (source) => ({
          source,
          headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
        })
      ),
    ];
  },
  async redirects() {
    return [
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/collections", destination: "/products", permanent: true },
      {
        source: "/collections/:slug",
        destination: "/category/:slug",
        permanent: true,
      },
      // Policy pages moved under /policies when the real documents landed
      {
        source: "/terms",
        destination: "/policies/terms",
        permanent: true,
      },
      {
        source: "/shipping-returns",
        destination: "/policies/shipping-delivery",
        permanent: true,
      },
      {
        source: "/cookies",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
