import type { NextConfig } from "next";

// When uploads go to Supabase Storage (live site), serve them under this site's own
// URLs: /imranh_cv.pdf and /papers/<name>.pdf. Must match STORAGE_BUCKET in src/lib/supabase.ts.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageBase =
  supabaseUrl?.startsWith("http") && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/portfolio-files`
    : null;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    if (!storageBase) return [];
    return {
      // The uploaded CV replaces the copy bundled in public/
      beforeFiles: [{ source: "/imranh_cv.pdf", destination: `${storageBase}/cv/imranh_cv.pdf` }],
      afterFiles: [],
      // Papers bundled in public/papers/ are served first; anything else comes from storage
      fallback: [{ source: "/papers/:name", destination: `${storageBase}/papers/:name` }],
    };
  },
};

export default nextConfig;
