import type { NextConfig } from "next";
import { defaultLocale } from "./src/i18n/locales";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:locale/booking/cancel", headers: [
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ] }];
  },
  async redirects() {
    return [{ source: "/", destination: `/${defaultLocale}`, permanent: false }];
  },
};
export default nextConfig;
