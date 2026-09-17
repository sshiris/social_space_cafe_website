import type { NextConfig } from "next";
import { defaultLocale } from "./src/i18n/locales";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: `/${defaultLocale}`, permanent: false }];
  },
};
export default nextConfig;
